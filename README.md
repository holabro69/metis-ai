# METIS AI | Study Workspace

A highly polished, modern, cognitive study companion designed for deep learning, structural study planning, dynamic recall, and continuous self-assessment.

---

## 🚀 Quick AI Context (For Future AI Models & Agents)

> **Hey there! 👋** If you are an AI model taking over or assisting with this codebase, read this section to immediately understand the system state and architecture.

### Tech Stack & Architecture
- **Frontend**: Single-Page Application (SPA) built with **React (v18+)**, **Vite**, **TypeScript**, and **Tailwind CSS**. Animated transitions and smooth state changes are driven by `motion` (imported from `motion/react`).
- **Backend**: Hybrid **Express + Vite Server** (`server.ts`) serving as a secure server-side proxy. It shields and isolates the `GEMINI_API_KEY` from the client-side while exposing clean REST endpoints (`/api/chat`, `/api/generate-syllabus`, `/api/generate-flashcards`, `/api/generate-quiz`).
- **AI Core**: Powered by **Gemini 1.5** using the official modern `@google/genai` Node.js SDK on the backend.
- **Mock Mode**: Includes a highly functional **"Mock AI Mode"** toggle in the sidebar. When active, it short-circuits live network calls and serves pre-compiled study schemas from `src/mockData.ts` for instant offline testing and design debugging.

### Styling & Visual Identity: "Professional Polish"
- **Color Palette**: Dark mode theme centered around a sophisticated slate canvas:
  - Main Background: `#343541` (Slate Gray)
  - Sidebar / Header Panels: `#202123` (Charcoal Charcoal)
  - Primary Accent: `#7C3AED` (Deep Violet)
  - Secondary Accent: `#2DD4BF` (Bright Teal)
  - Text Elements: High-contrast `#ECECF1` for body text and `#9A9DAE` for muted details.
- **Key Visual Elements**:
  - **Glassmorphism**: `.glass` containers featuring modern background-blur filters (`backdrop-blur-md`) and subtle translucent borders (`border-white/10`).
  - **Ambient Glows**: Pulse-animated neon glowing orbs (`.ambient-glow` utilizing `glow-1` and `glow-2`) drifting softly in the background.
  - **Premium Typography**: Pairing of **Inter** for standard user interface text, **Space Grotesk** for display headings, and **JetBrains Mono** for technical code snippets and indicators.

---

## 🛠️ Folder Structure & Core Files

- `/server.ts` - Express backend server. Handles both static file routing (production build) and Vite's development middleware, alongside the Gemini API proxy endpoints.
- `/src/App.tsx` - The central application controller. Orchestrates the dashboard, active recall flashcards, interactive multi-choice quiz, study syllabus checklists, and real-time messaging stream.
- `/src/mockData.ts` - Comprehensive local curriculum mappings (Quantum Mechanics, Cellular Biology, Linear Algebra) supporting mock state compilation.
- `/src/index.css` - Central tailwind stylesheet importing font engines and custom animation styles.
- `/metadata.json` - Active platform configurations and capabilities.

---

## ⚡ How to Run & Deploy

Ensure a valid node environment, then run:

### 1. Installation
```bash
npm install
```

### 2. Running in Development
The system uses the Express server to route requests dynamically in development:
```bash
npm run dev
```
*Accessible on port `3000` via our container reverse proxy.*

### 3. Production Compilation & Launch
```bash
npm run build
npm start
```

---

## 📈 Project Status & Achievements

1. **Fully Responsive Workspace Layout**: Interactive left sidebar for curriculum choosing, dynamic syllabus checklist completion, and full-bleed main workspace panel.
2. **Dynamic Hub Navigation**: Easily tab between the main study **Chat Stream**, active **Recall Flashcards**, and **Assessment Quizzes** on the fly.
3. **Double-Sided Active Recall Cards**: Fully interactive 3D card flip animation on click with active-recall summaries.
4. **Graded Assessment Engine**: Interactive multiple-choice rendering with dynamic grading, score ratios, and custom answers explanation block.
5. **Robust Local Fallback**: Toggle Mock AI Mode to immediately test comprehensive study material without using production API tokens.

---

## 🔮 Future Goals & Backlog (To Be Added)

<!-- Future development objectives, feature requests, or scaling pipelines can be documented below by the user or subsequent developers -->

- 
- 
- 

