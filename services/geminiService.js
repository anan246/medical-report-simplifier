import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "fs/promises";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const EXTRACTION_PROMPT = `You are a medical laboratory report data extraction engine. Your job is to read the COMPLETE medical report provided and extract EVERY test result present.

═══════════════════════════════════════════════
STEP 1 — READ THE COMPLETE REPORT
═══════════════════════════════════════════════
- Read ALL pages from start to finish
- Identify ALL sections (CBC, Lipid Profile, Liver Function, Kidney Function, Thyroid, Glucose, Urinalysis, Hormones, Vitamins, Electrolytes, Cultures, or ANY other section)
- Do NOT stop after the first section or first page
- Do NOT assume the report only contains one type of test

═══════════════════════════════════════════════
STEP 2 — EXTRACT EVERY TEST
═══════════════════════════════════════════════
- Extract EVERY measurable/reportable test result found anywhere in the report
- Do NOT use a fixed list of test names — the report itself determines what tests exist
- If a test name is unfamiliar or unusual, still extract it
- If a section header appears (e.g. "COMPLETE BLOOD COUNT"), treat everything under it as tests to extract
- Extract sub-tests and calculated ratios if they appear as separate rows with values

═══════════════════════════════════════════════
STEP 3 — CURRENT VS PREVIOUS VALUES
═══════════════════════════════════════════════
- Many reports show both a CURRENT result and a PREVIOUS result in separate columns
- ALWAYS use the CURRENT/PRESENT result as the main value
- Do NOT create a separate test entry for the previous value
- If only one value exists, use that
- Mention previous values only in the aiSummary

═══════════════════════════════════════════════
STEP 4 — REFERENCE RANGE
═══════════════════════════════════════════════
- Use ONLY the reference range explicitly printed in the report
- NEVER invent or assume a reference range from general medical knowledge
- If no reference range is provided for a test: use "N/A"
- If the report shows a range like "12.0 - 16.0" or "< 5.0" or "> 40", capture it exactly as a string

═══════════════════════════════════════════════
STEP 5 — STATUS DETERMINATION
═══════════════════════════════════════════════
Determine status using this priority order:
1. If the report explicitly marks the result as H, High, HIGH, L, Low, LOW, Abnormal, Critical → use that
   - H/High/HIGH/above → "above_range"
   - L/Low/LOW/below → "below_range"
2. If a reference range is provided, calculate:
   - value within range → "normal"
   - value above range → "above_range"
   - value below range → "below_range"
3. If no reference range and no flag → "unknown"

For non-numeric results (e.g. Appearance: "Clear", Culture: "No growth"):
- value: 0
- unit: ""
- status: "unknown"
- Include the text result in the testName or referenceRange field

═══════════════════════════════════════════════
STEP 6 — DEDUPLICATION
═══════════════════════════════════════════════
- Each test must appear ONLY ONCE in the output
- Remove duplicates caused by: repeated headers, page breaks, OCR repetition, current/previous columns
- If the same test appears multiple times with the same value, keep only one entry
- If the same test appears as both current and previous, keep only the current value

═══════════════════════════════════════════════
STEP 7 — SUMMARY
═══════════════════════════════════════════════
Write a detailed factual aiSummary that includes:
- What type of report this is
- Which sections/panels were found
- Total number of tests extracted
- A brief mention of each test with its value, unit, and reference range
- Any tests flagged as above or below range (using report-provided flags only)
- Previous values if present in the report
- Report date if visible in the document
Do NOT diagnose. Do NOT recommend treatment. Do NOT infer disease. Only describe what is written in the report.

═══════════════════════════════════════════════
OUTPUT FORMAT — RETURN ONLY THIS JSON, NOTHING ELSE
═══════════════════════════════════════════════
{
  "tests": [
    {
      "testName": "exact name as shown in report",
      "value": numeric_value_or_0_for_non_numeric,
      "unit": "unit string or empty string",
      "referenceRange": "range as shown in report or N/A",
      "status": "normal|above_range|below_range|unknown"
    }
  ],
  "aiSummary": "detailed factual summary as described above",
  "reportType": "detected report type e.g. Complete Blood Count, Lipid Profile, Comprehensive Metabolic Panel, etc."
}

CRITICAL REMINDERS:
- Extract ALL tests — not just CBC, not just Hemoglobin
- Read ALL pages — not just page 1
- Use ONLY reference ranges from the report
- One entry per test (current value only)
- No diagnosis, no treatment recommendations
- Return ONLY the JSON object, no markdown, no explanation`;

export async function extractMedicalReport(filePath, mimeType, reportText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
    generationConfig: {
      temperature: 0.1, // low temperature for consistent structured extraction
      responseMimeType: "application/json",
    },
  });

  let result;

  if (mimeType.startsWith("image/")) {
    const imageBuffer = await readFile(filePath);
    const base64 = imageBuffer.toString("base64");
    result = await model.generateContent([
      EXTRACTION_PROMPT,
      { inlineData: { mimeType, data: base64 } },
    ]);
  } else {
    const prompt = `${EXTRACTION_PROMPT}\n\n═══════════════════════════════════════════════\nMEDICAL REPORT CONTENT (COMPLETE TEXT — ALL PAGES)\n═══════════════════════════════════════════════\n${reportText}`;
    result = await model.generateContent(prompt);
  }

  const responseText = result.response.text();

  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON. Raw: ${cleaned.slice(0, 400)}`);
  }

  return validateAndEnrichGeminiResponse(parsed);
}

function validateAndEnrichGeminiResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Gemini response is not a valid object");
  }

  if (!Array.isArray(data.tests)) {
    throw new Error("Gemini response missing 'tests' array");
  }

  if (data.tests.length === 0) {
    // Not a lab report — still return summary with empty tests
    return {
      tests: [],
      aiSummary: typeof data.aiSummary === "string" ? data.aiSummary : "No structured test results were found in this document. It may be a narrative/consultant report rather than a laboratory results report.",
      reportType: typeof data.reportType === "string" ? data.reportType : "Medical Report",
    };
  }

  const validStatuses = ["normal", "above_range", "below_range", "unknown"];

  // Deduplicate by testName (case-insensitive), keeping first occurrence
  const seen = new Set();
  const deduplicated = data.tests.filter((test) => {
    const key = String(test.testName || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const tests = deduplicated.map((test, i) => {
    if (!test.testName || typeof test.testName !== "string") {
      throw new Error(`Test at index ${i} is missing testName`);
    }

    // Coerce value to number safely
    const rawValue = test.value;
    const numValue = typeof rawValue === "number"
      ? rawValue
      : parseFloat(String(rawValue).replace(/[^0-9.\-]/g, ""));
    const safeValue = isNaN(numValue) ? 0 : numValue;

    const status = validStatuses.includes(test.status) ? test.status : "unknown";

    return {
      testId: uuidv4(),
      testName: String(test.testName).trim(),
      value: safeValue,
      unit: String(test.unit || "").trim(),
      referenceRange: String(test.referenceRange || "N/A").trim(),
      status,
    };
  });

  return {
    tests,
    aiSummary: typeof data.aiSummary === "string" ? data.aiSummary : "",
    reportType: typeof data.reportType === "string" ? data.reportType : "Medical Report",
  };
}
