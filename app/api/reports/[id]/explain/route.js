import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import Report from "../../../../../models/Report";
import { normalizeReport } from "../../../../../lib/reportAdapter";
import { getAuthenticatedUser } from "../../../../../lib/auth";
import { privateJson } from "../../../../../lib/apiResponse";
import { generateWithFallback, getGenAI, isQuotaError } from "../../../../../services/geminiService";

/**
 * Turns the model's reply into the four explanation fields. JSON mode is requested, but
 * a stray code fence or plain-text reply is still handled instead of failing.
 */
function parseExplanation(raw) {
  const jsonText = String(raw || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed = null;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    parsed = null;
  }

  const asText = (value) => (typeof value === "string" ? value.trim() : "");

  if (!parsed || typeof parsed !== "object") {
    return jsonText ? { summary: jsonText, whatItMeasures: "", resultMeaning: "", referenceRangeNote: "" } : null;
  }

  const explanation = {
    summary: asText(parsed.summary),
    whatItMeasures: asText(parsed.whatItMeasures),
    resultMeaning: asText(parsed.resultMeaning),
    referenceRangeNote: asText(parsed.referenceRangeNote),
  };
  if (!explanation.summary) explanation.summary = jsonText;

  return explanation.summary ? explanation : null;
}

function buildPrompt(test, reportName) {
  return `You are a medical report simplification assistant for MediLens.

Your role is to help patients understand the information shown on their medical report.

STRICT RULES:
- Do NOT diagnose any disease or condition.
- Do NOT say the patient "has" any disease or condition.
- Do NOT recommend any medication, treatment, or dosage.
- Do NOT predict future health outcomes.
- Do NOT invent information not provided below.
- Use simple, calm, patient-friendly language.
- Acknowledge that reference ranges can vary between laboratories.
- Remind the patient that a healthcare professional interprets results in full context.

REPORT INFORMATION:
Report: ${reportName}
Test: ${test.testName}
Reported Value: ${test.value} ${test.unit}
Reference Range (from this report): ${test.referenceRange || "Not provided"}
Status: ${test.status || "Not specified"}

Return ONLY a valid JSON object with exactly these fields:
{
  "summary": "One or two sentences summarising what this test result shows, in plain language.",
  "whatItMeasures": "A simple explanation of what this test generally measures.",
  "resultMeaning": "A neutral explanation of what the reported value means relative to the reference range shown on this report.",
  "referenceRangeNote": "A brief note explaining that reference ranges can vary and that a healthcare professional should interpret this result in context."
}

Do not include any text outside the JSON object.`;
}

export async function POST(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { testId } = body;
  if (!testId) {
    return NextResponse.json({ error: "testId is required." }, { status: 400 });
  }

  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await connectDB();

    // Try _id (ObjectId hex) first, then reportId (UUID)
    let doc = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      doc = await Report.findOne({ _id: id, userId: user.userId }).lean();
    }
    if (!doc) {
      doc = await Report.findOne({ reportId: id, userId: user.userId }).lean();
    }

    if (!doc) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const report = normalizeReport(doc);

    const test = report.tests.find((t) => t.id === testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    const result = await generateWithFallback(getGenAI(), buildPrompt(test, report.reportName), {
      temperature: 0.3,
      responseMimeType: "application/json",
    });

    const explanation = parseExplanation(result.response.text());
    if (!explanation) throw new Error("The AI returned an empty explanation.");

    return privateJson({ explanation });
  } catch (err) {
    console.error("[POST /api/reports/:id/explain]", err.message);
    if (isQuotaError(err?.message)) {
      return NextResponse.json(
        { error: "The AI service is rate-limited right now. Please try again in a moment." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate the explanation. Please try again." },
      { status: 502 },
    );
  }
}
