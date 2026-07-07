import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy load Gemini AI client to prevent crash if GEMINI_API_KEY is not set
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required. Please check your Secrets panel in the Settings menu.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Route for METIS AI Study Companion
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, option } = req.body; // option can be 'chat' | 'quiz' | 'flashcard' | 'plan'
      const client = getGeminiClient();

      // Format messages for @google/genai
      const slidingWindow = messages.slice(-6);

      const contents = slidingWindow.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      let systemInstruction = "You are METIS AI, an elite AI study companion and expert tutor. " +
        "Your tone is modern, engaging, inspiring, and direct. Break down complex topics into digestible explanations using clean Markdown, spacing, and clear structure. Use bolding and lists to create rhythm. Keep answers concise but insightful.";

      if (option === "quiz") {
        systemInstruction += " You must generate a highly relevant 3-question multiple choice quiz on the subject or current topic. Return ONLY the JSON array matching the requested schema. Ensure the id field contains a unique identifier (e.g. q1, q2, q3).";
        
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              description: "A list of multiple choice quiz questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
        });
        
        return res.json({ text: response.text });
      } else if (option === "flashcard") {
        systemInstruction += " You must generate a set of 4 premium interactive flashcards on the subject. Return ONLY the JSON array matching the requested schema. Ensure the id field contains a unique identifier (e.g. fc1, fc2, fc3, fc4).";
        
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              description: "A list of educational flashcards with a clear conceptual question on the front and concise answer/explanation on the back",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  subject: { type: Type.STRING },
                },
                required: ["id", "front", "back", "subject"],
              },
            },
          },
        });
        
        return res.json({ text: response.text });
      } else if (option === "plan") {
        systemInstruction += " The user wants a custom study plan. Generate a 4-step structured micro-curriculum. Return a JSON array matching the requested schema. Ensure each item has a unique id (e.g. pl1, pl2, pl3, pl4).";
        
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              description: "A list of study milestones/plan items",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN },
                },
                required: ["id", "title", "duration", "completed"],
              },
            },
          },
        });
        
        return res.json({ text: response.text });
      } else {
        // Standard chat text generation
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
          },
        });
        
        return res.json({ text: response.text });
      }
    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred on the server." });
    }
  });

  // Serve static files in development & production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
