<div align="center">
  <img src="https://img.icons8.com/fluency/96/stethoscope.png" alt="Doctor AI Logo" width="80" />
  <h1 align="center">Doctor AI</h1>
  <p align="center">
    <strong>The World's Most Intelligent, Clinical AI Assistant.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#the-llm-engine">The LLM Engine</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 🚀 Overview

**Doctor AI** is an enterprise-grade, highly-performant web application designed to act as your personal clinical expert. Built with an uncompromising focus on a premium, minimal, pure-dark aesthetic (inspired by modern SaaS platforms), it provides instantaneous, empathetic, and profound medical insights.

Recently upgraded to a **Full-Stack Serverless Architecture**, Doctor AI now features secure user authentication, persistent clinical chat histories, live voice dictation, and native PDF report synthesis, fully deployed on Vercel.

## ✨ Features

- **Secure Authentication:** Password-less or credential-based login fortified by NextAuth.js and Supabase.
- **Persistent Chat Memory:** All clinical sessions are securely stored in a cloud PostgreSQL database mapped via Prisma ORM.
- **Microphone Dictation:** Native browser Speech-to-Text integration for rapid, hands-free symptom descriptions.
- **Clinical PDF Generation:** One-click functionality to synthesize your chat history into formally structured, printable medical PDF reports.
- **Multimodal AI Vision:** Seamlessly upload and analyze medical documents (`.pdf`) and visual injury/symptom images (`.jpg`, `.png`).
- **Premium Dark Architecture:** A completely distraction-free, high-contrast, strictly monochromatic UI built with modern Tailwind.
- **Extreme Speed:** Zero wait times. Get compassionate, structured responses in milliseconds via serverless Node infrastructure.

## 🧠 The LLM Engine (Powered by Gemini)

At the heart of Doctor AI is the state-of-the-art **Google Gemini 2.5 Flash** large language model. 

### Why Gemini 2.5 Flash?
We engineered the backend to leverage Gemini's bleeding-edge multimodal capabilities natively. By utilizing the `@google/generative-ai` SDK, Doctor AI translates raw byte-buffers from PDFs and Images directly into inline data payloads for the model, meaning it physically *sees* the images and explicitly *reads* the raw text asynchronously.

### Advanced Prompt Engineering
We utilize a heavily customized `SYSTEM_INSTRUCTION` architecture that grounds the AI's persona as the *"world's most intelligent medical doctor."* 
1. **Zero AI-Speak:** The model is strictly prohibited from breaking character or using robotic "As an AI..." qualifiers.
2. **Clinical Scannability:** Responses are aggressively formatted into short 1-3 sentence blocks, utilizing heavy markdown bullet-points instead of wall-of-text paragraphs (crucial for users who are seeking rapid, stress-free answers).
3. **Safety & Empathy:** Hardcoded system parameters ensure empathetic symptom acknowledgment alongside a mandatory, non-intrusive medical disclaimer.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 18
- **Styling & UI:** Tailwind CSS, Lucide React, `react-markdown`
- **Authentication:** NextAuth.js
- **Database ORM:** Prisma
- **Cloud Database:** Supabase (Serverless PostgreSQL)
- **AI/LLM Engine:** Google Generative AI (`gemini-2.5-flash`)
- **Data Processing:** `pdf-parse` (binary PDF extraction), native Base64 encoding for image inference, `jspdf` & `html2canvas`.
- **Deployment:** Vercel CI/CD Pipeline

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Google AI Studio API Key (`GEMINI_API_KEY`)
- Supabase Project (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- NextAuth Secret (`NEXTAUTH_SECRET`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imharry18/Doctor-AI.git
   cd Doctor-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   DATABASE_URL=postgresql://postgres.xxx:password@aws-0-pooler.supabase.com:6543/postgres
   NEXTAUTH_SECRET=your_super_secret_cryptographic_string
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel:**
   Link this repository to your Vercel dashboard. Ensure the **Build Command** is set to `prisma generate && next build`, and securely copy all `.env` variables into the Vercel Environment Configuration panel.

---
<div align="center">
  <i>Disclaimer: Doctor AI is for informational purposes only and does not provide professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</i>
</div>
