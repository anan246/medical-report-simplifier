import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Returns a configured Gemini model instance.
 * @param {string} model - Model name (default: "gemini-3.5-flash-lite")
 * @param {object} generationConfig - Optional generation config overrides
 */
export function getGeminiModel(model = "gemini-3.5-flash-lite", generationConfig = {}) {
  return genAI.getGenerativeModel({ model, generationConfig });
}

export default genAI;
