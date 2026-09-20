import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateWithFallback, getGenAI } from "@/services/geminiService";

const LANGUAGE_NAMES = { hi: "Hindi", kn: "Kannada" };

export async function POST(request) {
  if (!getAuthenticatedUser(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

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

  try {
    const result = await generateWithFallback(
      getGenAI(),
      `Translate the following medical report explanation into ${LANGUAGE_NAMES[language]}. Preserve every test name, number, decimal, unit, reference range, and status exactly. Do not add diagnosis, treatment, advice, or any new information. Return only the translation.\n\nTEXT:\n${text}`,
      { temperature: 0.2 },
    );
    return NextResponse.json({ translatedText: result.response.text().trim() });
  } catch (error) {
    console.error("[POST /api/voice/translate]", error.message);
    return NextResponse.json({ error: "Unable to prepare the translated voice text." }, { status: 502 });
  }
}