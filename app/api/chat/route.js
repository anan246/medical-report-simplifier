import { getGeminiModel } from "@/lib/geminiClient";

export async function POST(req) {
  try {
    const { message, report } = await req.json();

    if (!message?.trim()) {
      return Response.json({ success: false, message: "Message is required" }, { status: 400 });
    }
    if (!report) {
      return Response.json({ success: false, message: "Report context is required" }, { status: 400 });
    }

    const reportContext = `
Report Name: ${report.reportName || "Unknown"}
Report Type: ${report.reportType || "Unknown"}
AI Summary: ${report.aiSummary || "None"}

Test Results:
${(report.tests || []).map((t) =>
  `- ${t.testName}: ${t.value} ${t.unit || ""} (Ref: ${t.referenceRange || "N/A"}) — ${t.status}`
).join("\n")}
`.trim();

    const systemPrompt = `You are MediLens Assistant, a helpful AI that explains medical lab report results in simple, easy-to-understand language.

You have access to the following medical report data:
${reportContext}

Rules:
- Answer ONLY questions related to this report or general health literacy
- Explain medical terms in plain language
- NEVER diagnose, prescribe, or recommend treatment
- NEVER make up values not present in the report
- Always remind the user to consult a qualified healthcare professional for medical advice
- Keep responses concise and friendly
- If asked something unrelated to the report or health, politely redirect`;

    const model = getGeminiModel("gemini-3.5-flash-lite", { temperature: 0.4 });
    const result = await model.generateContent(`${systemPrompt}\n\nUser question: ${message}`);
    const reply = result.response.text();

    return Response.json({ success: true, reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json({ success: false, message: "Failed to get response. Please try again." }, { status: 500 });
  }
}
