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

**Doctor AI** is an enterprise-grade, highly-performant web application designed to act as your personal clinical expert. Built with an uncompromising focus on a premium, minimal, pure-dark aesthetic (inspired by Linear and Vercel), it provides instantaneous, empathetic, and profound medical insights.

Whether you are uploading complex pathology PDF reports, sharing images of visual symptoms, or querying for rapid reassurance, Doctor AI parses the data securely and outputs perfectly formatted, scannable insights.

## ✨ Features

- **Multimodal Clinical Analysis:** Seamlessly upload and analyze medical documents (`.pdf`) and visual injury/symptom images (`.jpg`, `.png`).
- **Instant Native PDF Generation:** One-click "Download PDF" functionality to neatly export your clinical chats for offline reviewing or sharing with your human physician.
- **Premium Dark Architecture:** A completely distraction-free, high-contrast, beautiful monochromatic UI built with modern Tailwind.
- **Extreme Speed:** Zero wait times. Get compassionate, structured responses in milliseconds via serverless streaming.
- **Privacy-First:** Ephemeral file buffering ensures your sensitive health PDFs and images are processed securely in memory and never stored.

## 🧠 The LLM Engine (Powered by Gemini)

At the heart of Doctor AI is the state-of-the-art **Google Gemini 2.5 Flash** large language model. 

### Why Gemini 2.5 Flash?
We engineered the backend to leverage Gemini's bleeding-edge multimodal capabilities natively. By utilizing the `@google/generative-ai` SDK, Doctor AI translates raw byte-buffers from PDFs and Images directly into inline data payloads for the model, meaning it physically *sees* the images and explicitly *reads* the raw text.

### Advanced Prompt Engineering
We utilize a heavily customized `SYSTEM_INSTRUCTION` architecture that grounds the AI's persona as the *"world's most intelligent medical doctor."* 
We explicitly enforce strict system response rules:
1. **Zero AI-Speak:** The model is strictly prohibited from breaking character or using robotic "As an AI..." qualifiers.
2. **Clinical Scannability:** Responses are aggressively formatted into short 1-3 sentence blocks, utilizing heavy markdown bullet-points instead of wall-of-text paragraphs (crucial for users who are seeking rapid, stress-free answers).
3. **Safety & Empathy:** Hardcoded system parameters ensure empathetic symptom acknowledgment alongside a mandatory, non-intrusive medical disclaimer.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18
- **Styling:** Tailwind CSS (Custom stark dark-mode config)
- **Icons & Typography:** Lucide React, `react-markdown`
- **Backend/API:** Next.js Route Handlers (Serverless)
- **AI/LLM Engine:** Google Generative AI (`gemini-2.5-flash`)
- **Data Processing:** `pdf-parse` for binary PDF extraction, native Base64 encoding for image inference.

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Google AI Studio API Key (`GEMINI_API_KEY`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/doctor-ai.git
   cd "doctor-ai/frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of the `frontend` directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your modern browser.

---
<div align="center">
  <i>Disclaimer: Doctor AI is for informational purposes only and does not provide professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</i>
</div>