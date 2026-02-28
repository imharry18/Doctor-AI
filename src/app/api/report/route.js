import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

function getApiKey() {
  try {
    const envString = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envString.match(/GEMINI_API_KEY=(.+)/);
    if (match && match[1].trim()) return match[1].trim();
  } catch (e) {}
  return process.env.GEMINI_API_KEY || "";
}

const REPORT_INSTRUCTION = `You are an expert clinical summarization AI. Your task is to carefully read the provided interaction history between a patient and Doctor AI, and generate a highly structured, formal Medical Summary Report. 
Do NOT reply as a chatbot. Do NOT use conversational fillers. Output ONLY the structured report formatted beautifully in Markdown.

Use this strict structure:
# Medical Summary Report

**Date of Consultation:** [Insert formatted date]

## Patient Symptoms / Inquiries
[Use succinct bullet points summarizing what the patient asked, reported, or uploaded]

## Clinical Assessment
[Objective, clinical summary of the AI's analysis of the symptoms, PDF data, or images]

## Recommended Next Steps
[Bullet points of actionable lifestyle advice, remedies, or directives discussed]

***
*Disclaimer: This document is an AI-generated summary of a chat interaction designed to assist in personal health tracking. It is strictly NOT a substitute for professional medical advice, diagnosis, or treatment. Provide this summary to a qualified healthcare provider for proper evaluation.*
`;

export async function POST(req) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const formData = await req.formData();
    const historyString = formData.get('history');
    
    if (!historyString) {
      return new Response(JSON.stringify({ error: "No history provided." }), { status: 400 });
    }

    const history = JSON.parse(historyString);
    // Filter out the initial greeting to save tokens & relevance
    const relevantHistory = history.filter((msg, idx) => !(idx === 0 && msg.role === 'ai'));
    const mappedHistory = relevantHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");

    const prompt = `Please generate an official Medical Summary Report based on the following consultation log:\n\n=== CHAT LOG START ===\n${mappedHistory}\n=== CHAT LOG END ===\n\nCurrent Date Context: ${new Date().toLocaleDateString()}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: REPORT_INSTRUCTION
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ report: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Report API Error:", error);
    return new Response(JSON.stringify({ error: "An internal server error occurred while processing the report.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
