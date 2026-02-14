import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60; // Set higher max duration for Next.js

// Allow hot-reloading to grab the API key if next.js wasn't restarted
function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const envString = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const match = envString.match(/GEMINI_API_KEY=(.+)/);
    if (match) return match[1].trim();
  } catch (e) {}
  return "";
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
    
    const genAI = new GoogleGenerativeAI(apiKey);

    const formData = await req.formData();
    const userMessage = formData.get('message');
    const file = formData.get('file');
    const historyString = formData.get('history');
    
    let history = [];
    if (historyString) {
      try {
        history = JSON.parse(historyString);
      } catch (e) {
        console.warn("Failed to parse history");
      }
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

    // Format history for Gemini & ensure alternating user/model starting with user
    const rawHistory = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    let formattedHistory = [];
    for (const msg of rawHistory) {
      if (formattedHistory.length === 0) {
        // history MUST start with user
        if (msg.role === 'user') formattedHistory.push(msg);
      } else {
        // history MUST alternate
        if (formattedHistory[formattedHistory.length - 1].role !== msg.role) {
          formattedHistory.push(msg);
        } else {
          // Merge text if same role to maintain alternating structure
          formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + msg.parts[0].text;
        }
      }
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage([finalPrompt, ...imageParts]);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), {
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
