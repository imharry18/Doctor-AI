import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "@/lib/auth";

export const maxDuration = 60; // Set higher max duration for Next.js

// Force dynamic parsing of .env at runtime to bypass Next.js caching the old leaked key in memory
function getApiKey() {
  try {
    const envString = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envString.match(/GEMINI_API_KEY=(.+)/);
    if (match && match[1].trim()) return match[1].trim();
  } catch (e) {}
  return process.env.GEMINI_API_KEY || "";
}

const SYSTEM_INSTRUCTION = `You are Doctor AI, the world's most intelligent medical AI. You are a compassionate, highly capable personal clinical expert. People talking to you might be in pain, stressed, or seeking rapid, expert clinical reassurance.

CRITICAL RULES FOR RESPONDING:
1. NO AI-SPEAK: Never use robotic phrases like "As an AI language model..." Feel free to confidently act and speak as the world's most intelligent doctor.
2. MULTIMODAL CAPABILITY: You can analyze and process medical PDF reports as well as Medical Images (like injury photos, symptoms, or scans) seamlessly. If asked, confirm you can analyze both images and PDFs accurately.
3. KEEP IT BRIEF & SCANNABLE: Long paragraphs are hard to read for sick people. Use very short paragraphs (1-3 sentences maximum).
4. USE SIMPLE MARKDOWN: Use bullet points and bold text to highlight key takeaways so users can merely glance at your message to get the gist.
5. EMPATHY FIRST: Acknowledge their symptoms warmly and professionally.
6. THE DISCLAIMER: Give your disclaimer smoothly and briefly at the very end in a single short italicized sentence.`;

export async function POST(req) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    
    // Database Session Mapping
    let session = null;
    try { session = await getServerSession(authOptions); } catch (e) { console.error("Session error:", e); }
    const userId = session?.user?.id;

    const genAI = new GoogleGenerativeAI(apiKey);

    const formData = await req.formData();
    const userMessage = formData.get('message');
    const file = formData.get('file');
    const historyString = formData.get('history');
    let currentChatId = formData.get('chatId');
    
    let history = [];
    if (historyString) {
      try {
        history = JSON.parse(historyString);
      } catch (e) {
        console.warn("Failed to parse history");
      }
    }

    // Persist to Database Pre-flight
    if (userId) {
      if (!currentChatId || currentChatId === 'null') {
        const fallbackChat = await prisma.chat.findFirst({ where: { userId }, orderBy: { updatedAt: 'desc' }});
        if (fallbackChat) currentChatId = fallbackChat.id;
        else {
          const newChat = await prisma.chat.create({ data: { userId } });
          currentChatId = newChat.id;
        }
      }
      // Save User Message
      await prisma.message.create({
        data: {
          chatId: currentChatId,
          role: 'user',
          content: userMessage || "Attached Context",
          fileUrl: file?.name || null
        }
      });
    }

    let pdfText = "";
    let imageParts = [];
    
    if (file) {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        try {
          const parsedPdf = await pdfParse(buffer);
          pdfText = parsedPdf.text;
        } catch (err) {
          console.error("PDF Parsing Error:", err);
          return new Response(JSON.stringify({ error: "Failed to parse the uploaded PDF document." }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else if (file.type.startsWith("image/")) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageParts.push({
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: file.type
          }
        });
      }
    }

    // Prepare Prompt
    let finalPrompt = userMessage || "Please analyze the attached context in detail.";
    if (pdfText) {
      finalPrompt = `I have uploaded a medical report. Here is the extracted text from the report:\n\n=== REPORT TEXT START ===\n${pdfText.substring(0, 15000)}\n=== REPORT TEXT END ===\n\nUser Question/Context: ${userMessage}`;
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const rawHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    let formattedHistory = [];
    for (const msg of rawHistory) {
      if (formattedHistory.length === 0) {
        if (msg.role === 'user') formattedHistory.push(msg);
      } else {
        if (formattedHistory[formattedHistory.length - 1].role !== msg.role) {
          formattedHistory.push(msg);
        } else {
          formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + msg.parts[0].text;
        }
      }
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage([finalPrompt, ...imageParts]);
    const responseText = result.response.text();

    // Persist to Database Post-flight
    if (userId && currentChatId) {
      await prisma.message.create({
        data: {
          chatId: currentChatId,
          role: 'ai',
          content: responseText
        }
      });
      // Optionally update Chat Title based on first message
      if (history.length <= 1 && userMessage) {
        try {
           await prisma.chat.update({
             where: { id: currentChatId },
             data: { title: userMessage.substring(0, 30) + '...' }
           });
        } catch(e) {}
      }
    }

    return new Response(JSON.stringify({ reply: responseText, chatId: currentChatId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred while processing your request.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
