import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "../../../../../lib/mongodb";
import Report from "../../../../../models/Report";
import { normalizeReport } from "../../../../../lib/reportAdapter";

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: { temperature: 0.1 },
  });
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
    await connectDB();

    // Try _id (ObjectId hex) first, then reportId (UUID)
    let doc = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      doc = await Report.findById(id).lean();
    }
    if (!doc) {
      doc = await Report.findOne({ reportId: id }).lean();
    }

    if (!doc) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const report = normalizeReport(doc);

    const test = report.tests.find((t) => t.id === testId);
    if (!test) {
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    const model = getGeminiModel();
    const result = await model.generateContent(buildPrompt(test, report.reportName));
    const raw = result.response.text().trim();

    const jsonText = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let explanation;
    try {
      explanation = JSON.parse(jsonText);
    } catch {
      explanation = { summary: raw, whatItMeasures: "", resultMeaning: "", referenceRangeNote: "" };
    }

    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("[POST /api/reports/:id/explain]", err.message);
    return NextResponse.json({ error: "Failed to generate explanation." }, { status: 500 });
  }
}
