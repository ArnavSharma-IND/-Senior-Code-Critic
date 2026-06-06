import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment configurations
dotenv.config();

const PORT = 3000;

// Initialize Google GenAI on the backend
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // API Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Main Code Review API Endpoint
  app.post("/api/review", async (req, res) => {
    const { code, language, title } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Missing required raw code or language field." });
    }

    try {
      const codeExcerpt = code.substring(0, 10000); // Guard rails
      
      const systemInstruction = `You are an elite principal software architect, senior code auditor, and security expert.
Conduct a professional-grade, high-integrity code review. Your feedback must match standard corporate architectural guidelines.

Analyze the code for:
1. Syntax and logic bugs (infinite loops, concurrency hazards, thread-safety violations)
2. High-impact security vulnerabilities (owasp top 10, SQL injection, hardcoded credentials, buffer overflow)
3. Performance blocks (O(2^N) nesting overheads, memory leaks, unclosed streams or DB connections)
4. Clean Architecture, design patterns, and SOLID principle violations.

You must return a valid, un-truncated JSON object conforming strictly to the provided JSON Schema.
Return a genuine refactored code proposal that completely repairs all critical bugs, security vulnerabilities, and design failures you highlighted. The refactored code must be syntactically pristine for the chosen language.`;

      const prompt = `Code File Name: "${title || "raw_code_snippet"}"
Language: "${language}"

Inspect the following source code:
\`\`\`${language}
${codeExcerpt}
\`\`\``;

      // Call Gemini using 3.5 Flash for reasoning power and speed
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high deterministic accuracy
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: {
                type: Type.INTEGER,
                description: "Overall quality score of the code, from 0 (very vulnerable/broken) to 100 (flawless, polished production quality). Be realistic and strict.",
              },
              executiveSummary: {
                type: Type.STRING,
                description: "Concise executive overview of code craftsmanship, highlighting key breakthroughs or immediate risks.",
              },
              complexity: {
                type: Type.OBJECT,
                properties: {
                  cyclomaticComplexity: { type: Type.STRING, description: "Rating of the complexity level (e.g. 'Low (2)', 'High (14)')" },
                  spaceComplexity: { type: Type.STRING, description: "Space complexity estimation in Big-O notation (e.g. 'O(1)', 'O(N)')" },
                  timeComplexity: { type: Type.STRING, description: "Time complexity estimation in Big-O notation (e.g. 'O(N)', 'O(N log N)', 'O(2^N)')" },
                  maintainabilityIndex: { type: Type.INTEGER, description: "Cleanliness score from 0 to 100" },
                },
                required: ["cyclomaticComplexity", "spaceComplexity", "timeComplexity", "maintainabilityIndex"],
              },
              issues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    line: { type: Type.INTEGER, description: "Line number where the issue occurs, if applicable." },
                    snippet: { type: Type.STRING, description: "Line code snippet matching the violation." },
                    title: { type: Type.STRING, description: "Short descriptive name of the flaw." },
                    description: { type: Type.STRING, description: "Full explanation of the threat or standard violation." },
                    severity: { 
                      type: Type.STRING, 
                      enum: ["critical", "warning", "suggestion", "info"],
                      description: "Importance tier of the issue." 
                    },
                    category: { 
                      type: Type.STRING, 
                      enum: ["bug", "security", "performance", "style", "architecture"],
                      description: "Classification of vulnerability." 
                    },
                    remediation: { type: Type.STRING, description: "Actionable prescription or guard to repair this specific issue." },
                  },
                  required: ["title", "description", "severity", "category", "remediation"],
                },
              },
              refactoredCode: {
                type: Type.STRING,
                description: "Full refactored code suggestion which adheres to SOLID, resolves security concerns, and optimizes space/time complexity.",
              },
            },
            required: ["overallScore", "executiveSummary", "complexity", "issues", "refactoredCode"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty reasoning response from Gemini Engine.");
      }

      const cleanJson = JSON.parse(responseText.trim());
      res.json(cleanJson);
    } catch (error: any) {
      console.error("AI Code Critique Error:", error);
      res.status(500).json({ 
        error: "Code analysis failed.", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Express Vite handler configuration
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
    console.log(`Server standing strong on port ${PORT}`);
  });
}

startServer();
