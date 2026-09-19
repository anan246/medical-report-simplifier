import { getGeminiModel } from "@/lib/geminiClient";

const SYSTEM_PROMPT = `You are MediLens Support Assistant — a friendly, helpful support agent for the MediLens web application.

About MediLens:
- MediLens is an AI-powered medical report simplifier
- Users can upload PDF or image lab reports (CBC, Lipid Panel, LFT, KFT, Thyroid, Urinalysis, etc.)
- The AI extracts every test result, compares it to reference ranges, and shows Normal / Above Range / Below Range status
- There is also a report-specific chatbot that answers questions about a user's uploaded report
- MediLens does NOT provide medical diagnoses or treatment advice
- It is free to use and requires no account

You can help users with:
- How to use MediLens (upload steps, supported formats, file size limits)
- Understanding what MediLens does and does not do
- Troubleshooting issues (upload errors, analysis failures, slow processing)
- General questions about the app features
- Privacy and data questions
- Contact / feedback

Rules:
- Be warm, concise, and helpful
- NEVER provide medical diagnoses or treatment recommendations
- If asked a medical question, explain you can only help with app-related questions and suggest they consult a doctor
- Always respond in the SAME LANGUAGE the user writes in
- Keep responses short and scannable — use bullet points when listing steps
- If you cannot resolve an issue, suggest the user email: support@medilens.app`;

export async function POST(req) {
  try {
    const { message, language, history } = await req.json();

    if (!message?.trim()) {
      return Response.json({ success: false, message: "Message is required" }, { status: 400 });
    }

    const langInstruction = language && language !== "en"
      ? `\n\nIMPORTANT: The user's preferred language is "${language}". Respond in that language unless the user writes in a different language — always match the user's language.`
      : "";

    const conversationHistory = (history || [])
      .slice(-6) // keep last 6 exchanges for context
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${SYSTEM_PROMPT}${langInstruction}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ""}
User: ${message}`;

    const model = getGeminiModel("gemini-3.5-flash-lite", { temperature: 0.5 });
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    return Response.json({ success: true, reply });
  } catch (err) {
    console.error("Support chat error:", err);
    return Response.json({ success: false, message: "Failed to get response. Please try again." }, { status: 500 });
  }
}
