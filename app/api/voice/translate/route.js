import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateWithFallback, getGenAI } from "@/services/geminiService";

const LANGUAGE_NAMES = { hi: "Hindi", kn: "Kannada" };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { text, language } = body;
  if (typeof text !== "string" || !text.trim() || text.length > 12000) {
    return NextResponse.json({ error: "Text must be between 1 and 12,000 characters." }, { status: 400 });
  }
  if (!LANGUAGE_NAMES[language]) {
    return NextResponse.json({ error: "Unsupported voice language." }, { status: 400 });
  }

  // Check auth; if unauthenticated, cap text length to prevent abuse
  const user = getAuthenticatedUser(request);
  if (!user && text.length > 4000) {
    return NextResponse.json({ error: "Authentication required for long text translation." }, { status: 401 });
  }

  try {
    const result = await generateWithFallback(
      getGenAI(),
      `Translate the following medical report content into clear, natural ${LANGUAGE_NAMES[language]} suitable for text-to-speech reading. Preserve every test name, numeric value, decimal, unit, and reference range accurately. Do not include markdown formatting, bullet asterisks, code blocks, or preamble. Return ONLY the spoken translation text.\n\nTEXT:\n${text}`,
      { temperature: 0.2 },
    );

    let translatedText = result.response.text().trim();
    // Clean up markdown fences or labels if present
    translatedText = translatedText
      .replace(/^```[a-z]*\s*/i, "")
      .replace(/\s*```$/i, "")
      .replace(/^[#*>\s]+/gm, "")
      .trim();

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("[POST /api/voice/translate]", error.message);
    return NextResponse.json({ error: "Unable to prepare the translated voice text." }, { status: 502 });
  }
}