"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReadAloud from "@/components/ReadAloud";
import { useTheme } from "@/components/ThemeProvider";

// Static educational descriptions keyed by lowercase test name
// (testId is now a UUID so we match on the normalized test name instead)
const testDescriptions = {
  "hemoglobin":
    "Hemoglobin is a protein in red blood cells that helps carry oxygen throughout the body.",
  "rbc count":
    "Red blood cell count measures the number of red blood cells in a given volume of blood.",
  "red blood cell count":
    "Red blood cell count measures the number of red blood cells in a given volume of blood.",
  "wbc count":
    "White blood cell count measures the number of white blood cells in a given volume of blood.",
  "white blood cell count":
    "White blood cell count measures the number of white blood cells in a given volume of blood.",
  "platelet count":
    "Platelets are blood components involved in normal blood clotting.",
  "platelets":
    "Platelets are blood components involved in normal blood clotting.",
  "hematocrit":
    "Hematocrit represents the percentage of blood volume made up of red blood cells.",
  "hba1c":
    "HbA1c reflects average blood glucose levels over the past two to three months.",
  "fasting blood sugar":
    "Fasting blood sugar measures the level of glucose in the blood after a period without eating.",
  "cholesterol":
    "Cholesterol is a fatty substance found in the blood that is needed for building cells.",
  "triglyceride":
    "Triglycerides are a type of fat found in the blood, stored from calories not immediately used.",
  "hdl cholesterol":
    "HDL cholesterol is often referred to as the good cholesterol and helps remove other forms of cholesterol from the bloodstream.",
  "tsh - thyroid stimulating hormone":
    "TSH is produced by the pituitary gland and regulates the thyroid gland's production of hormones.",
  "vitamin b12":
    "Vitamin B12 is essential for nerve function, red blood cell formation, and DNA synthesis.",
  "25(oh) vitamin d":
    "Vitamin D supports bone health, immune function, and various other body processes.",
  "creatinine, serum":
    "Creatinine is a waste product filtered by the kidneys; its level in the blood reflects kidney function.",
};

function getDescription(testName) {
  if (!testName) return null;
  return testDescriptions[testName.toLowerCase()] ?? null;
}

function StatusBadge({ status }) {
  const isWithin = status === "Within Range";
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        isWithin
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
      }`}
    >
      {isWithin ? "✓ Within Range" : "⚠ Outside Range"}
    </span>
  );
}

function ExplanationSection({ reportId, testId }) {
  const { language } = useTheme();
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | ok | error
  const [explanation, setExplanation] = useState(null);
  const [aiError, setAiError] = useState("");

  const fetchExplanation = useCallback(async () => {
    setAiStatus("loading");
    setExplanation(null);
    setAiError("");
    try {
      const res = await fetch(`/api/reports/${reportId}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ testId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.explanation) {
        setAiError(data?.error || "We couldn't generate the explanation right now.");
        setAiStatus("error");
        return;
      }
      setExplanation(data.explanation);
      setAiStatus("ok");
    } catch (err) {
      setAiError(err?.message || "We couldn't generate the explanation right now.");
      setAiStatus("error");
    }
  }, [reportId, testId]);

  if (aiStatus === "idle") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          AI Explanation
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Get a simple, patient-friendly explanation of this test result.
        </p>
        <button
          onClick={fetchExplanation}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors"
        >
          Explain This Result
        </button>
      </div>
    );
  }

  if (aiStatus === "loading") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          AI Explanation
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <svg className="animate-spin h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Understanding your result…
        </div>
        <div className="space-y-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (aiStatus === "error") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          AI Explanation
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300" role="alert">
          {aiError || "We couldn't generate the explanation right now."}
        </p>
        <button
          onClick={fetchExplanation}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ok — show structured explanation
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        AI Explanation
      </h3>

      {explanation.summary && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Simple Summary
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {explanation.summary}
          </p>
        </div>
      )}

      {explanation.whatItMeasures && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            What This Test Measures
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {explanation.whatItMeasures}
          </p>
        </div>
      )}

      {explanation.resultMeaning && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Understanding Your Result
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {explanation.resultMeaning}
          </p>
        </div>
      )}

      {explanation.referenceRangeNote && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Reference Range
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {explanation.referenceRangeNote}
          </p>
        </div>
      )}

      <ReadAloud
        text={[explanation.summary, explanation.whatItMeasures, explanation.resultMeaning, explanation.referenceRangeNote].filter(Boolean).join(" ")}
        language={language}
      />

      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        AI-generated explanations are for educational purposes only and should not replace advice from a qualified healthcare professional.
      </p>
    </div>
  );
}

export default function TestDetailPage() {
  const params = useParams();
  const { id, testId } = params;

  const [report, setReport] = useState(null);
  const [test, setTest] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | notfound | ok

  useEffect(() => {
    if (!id) return;
    async function load() {
      setStatus("loading");
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (res.status === 404) { setStatus("notfound"); return; }
        if (!res.ok) { setStatus("error"); return; }
        const data = await res.json();
        const found = data.tests?.find((t) => t.id === testId);
        if (!found) { setStatus("notfound"); return; }
        setReport(data);
        setTest(found);
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    }
    load();
  }, [id, testId]);

  const description = getDescription(test?.testName);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (status === "notfound") {
    return (
      <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-4 pt-20">
          <p className="text-4xl">🔍</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Test not found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Return to the report dashboard to view available tests.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
          >
            ← Back to Report Dashboard
          </Link>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 text-center space-y-3">
            <p className="font-medium text-slate-900 dark:text-white">
              Unable to load this test.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              There was a problem retrieving the test data.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors"
            >
              Return to Dashboard
            </Link>
            <Link
              href={`/reports/${id}`}
              className="inline-block mt-2 ml-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              ← Back to Test Results
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-40" />
          <div className="space-y-2">
            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-36" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-56" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Loaded ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back navigation */}
        <Link
          href={`/reports/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
        >
          ← Back to Test Results
        </Link>

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Test Details
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {report.reportName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {report.date}
          </p>
        </div>

        {/* Test information card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {test.testName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Result
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {test.value}
                <span className="text-base font-normal text-slate-600 dark:text-slate-300 ml-1">
                  {test.unit}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Reference Range
              </p>
              <p className="text-base text-slate-700 dark:text-slate-200 font-medium">
                {test.referenceRange || "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Status
              </p>
              {test.status ? (
                <StatusBadge status={test.status} />
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">—</span>
              )}
            </div>
          </div>
        </div>

        {/* About This Test */}
        {description && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              About This Test
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* AI Explanation */}
        <ExplanationSection reportId={id} testId={testId} />

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pb-4">
          This information is provided to help you understand the information shown on your medical report. It is not a medical diagnosis.
        </p>

      </div>
    </main>
  );
}
