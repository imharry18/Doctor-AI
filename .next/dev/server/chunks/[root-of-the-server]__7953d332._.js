module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Desktop/Doctor AI/src/app/api/report/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Doctor__AI$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Doctor AI/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const maxDuration = 60;
function getApiKey() {
    try {
        const envString = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.env'), 'utf8');
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
async function POST(req) {
    try {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Doctor__AI$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        const formData = await req.formData();
        const historyString = formData.get('history');
        if (!historyString) {
            return new Response(JSON.stringify({
                error: "No history provided."
            }), {
                status: 400
            });
        }
        const history = JSON.parse(historyString);
        // Filter out the initial greeting to save tokens & relevance
        const relevantHistory = history.filter((msg, idx)=>!(idx === 0 && msg.role === 'ai'));
        const mappedHistory = relevantHistory.map((msg)=>`${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
        const prompt = `Please generate an official Medical Summary Report based on the following consultation log:\n\n=== CHAT LOG START ===\n${mappedHistory}\n=== CHAT LOG END ===\n\nCurrent Date Context: ${new Date().toLocaleDateString()}`;
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: REPORT_INSTRUCTION
        });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return new Response(JSON.stringify({
            report: responseText
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Report API Error:", error);
        return new Response(JSON.stringify({
            error: "An internal server error occurred while processing the report.",
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7953d332._.js.map