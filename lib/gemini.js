import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy getter — throws only when actually called, not at import time.
// This prevents the server from crashing on startup if the key is not yet set.
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}
