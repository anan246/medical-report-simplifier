"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const testDescriptions = {
  "hemoglobin": "Hemoglobin is a protein in red blood cells that helps carry oxygen throughout the body.",
  "rbc count": "Red blood cell count measures the number of red blood cells in a given volume of blood.",
  "red blood cell count": "Red blood cell count measures the number of red blood cells in a given volume of blood.",
  "wbc count": "White blood cell count measures the number of white blood cells in a given volume of blood.",
  "white blood cell count": "White blood cell count measures the number of white blood cells in a given volume of blood.",
  "platelet count": "Platelets are blood components involved in normal blood clotting.",
  "platelets": "Platelets are blood components involved in normal blood clotting.",
  "hematocrit": "Hematocrit represents the percentage of blood volume made up of red blood cells.",
  "hba1c": "HbA1c reflects average blood glucose levels over the past two to three months.",
  "fasting blood sugar": "Fasting blood sugar measures the level of glucose in the blood after a period without eating.",
  "cholesterol": "Cholesterol is a fatty substance found in the blood that is needed for building cells.",
  "triglyceride": "Triglycerides are a type of fat found in the blood, stored from calories not immediately used.",
  "hdl cholesterol": "HDL cholesterol is often referred to as the good cholesterol and helps remove other forms of cholesterol from the bloodstream.",
  "tsh - thyroid stimulating hormone": "TSH is produced by the pituitary gland and regulates the thyroid gland's production of hormones.",
  "vitamin b12": "Vitamin B12 is essential for nerve function, red blood cell formation, and DNA synthesis.",
  "25(oh) vitamin d": "Vitamin D supports bone health, immune function, and various other body processes.",
  "creatinine, serum": "Creatinine is a waste product filtered by the kidneys; its level in the blood reflects kidney function.",
};

function getDescription(testName) {
  if (!testName) return null;
  return testDescriptions[testName.toLowerCase()] ?? null;
}

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse ${className}`} />;
}

function AICard({ icon, label, children }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <span>{icon}</span> {label}
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{children}</p>
    </div>
  );
}

function ExplanationSection({ reportId, testId }) {
  const [aiStatus, setAiStatus] = useState("idle");
  const [explanation, setExplanation] = useState(null);

  const fetchExplanation = useCallback(async () => {
    setAiStatus("loading");
    setExplanation(null);
    try {
      const res = await fetch(`/api/reports/${reportId}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      });
      if (!res.ok) { setAiStatus("error"); return; }
      const data = await res.json();
      setExplanation(data.explanation);
      setAiStatus("ok");
    } catch {
      setAiStatus("error");
    }
  }, [reportId, testId]);

  if (aiStatus === "idle") {
    return (
      <div className="relative overflow-hidden rounded-3xl h-44 shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=80"
          alt="AI medical analysis"
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-slate-700/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-7 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-semibold text-white text-base">AI Explanation</h3>
              <p className="text-slate-300 text-xs">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={fetchExplanation}
            className="self-start px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.97] backdrop-blur-sm"
          >
            ✨ Explain This Result
          </button>
        </div>
      </div>
    );
  }

  if (aiStatus === "loading") {
    return (
      <div className="relative overflow-hidden rounded-3xl h-44 shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=80"
          alt="AI medical analysis"
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-slate-700/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Analysing…</h3>
              <p className="text-slate-300 text-xs">Gemini is reading your result</p>
            </div>
          </div>
          <div className="space-y-2 max-w-xs">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2.5 bg-white/15 rounded-full animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (aiStatus === "error") {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">😔</div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Couldn&apos;t generate explanation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Something went wrong with the AI service.</p>
          </div>
        </div>
        <button
          onClick={fetchExplanation}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
      {/* Header with photo strip */}
      <div className="relative h-16 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&q=80"
          alt="AI analysis"
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="absolute inset-0 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">🤖</div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Explanation</h3>
            <p className="text-slate-300 text-xs">Powered by Gemini</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {explanation.summary && <AICard icon="💡" label="Simple Summary">{explanation.summary}</AICard>}
        {explanation.whatItMeasures && <AICard icon="🔬" label="What This Test Measures">{explanation.whatItMeasures}</AICard>}
        {explanation.resultMeaning && <AICard icon="📊" label="Understanding Your Result">{explanation.resultMeaning}</AICard>}
        {explanation.referenceRangeNote && <AICard icon="📏" label="Reference Range Note">{explanation.referenceRangeNote}</AICard>}
        <p className="text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          AI-generated explanations are for educational purposes only and should not replace advice from a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}

export default function TestDetailPage() {
  const params = useParams();
  const { id, testId } = params;

  const [report, setReport] = useState(null);
  const [test, setTest] = useState(null);
  const [status, setStatus] = useState("loading");

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
  const isWithin = test?.status === "Within Range";

  const mainClass = "min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8";

  if (status === "notfound") {
    return (
      <main className={mainClass}>
        <div className="max-w-2xl mx-auto text-center space-y-4 pt-20">
          <div className="text-6xl">🔍</div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Test not found</h1>
          <Link href="/report-dashboard" className="inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">
            ← Back to My Reports
          </Link>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={mainClass}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Link href="/report-dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors">
            ← Back to My Reports
          </Link>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-sm text-center space-y-4">
            <div className="text-5xl">😕</div>
            <p className="font-semibold text-slate-900 dark:text-white">Couldn&apos;t load this test</p>
            <Link href={`/reports/${id}`} className="inline-block px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95">
              ← Back to Test Results
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <main className={mainClass}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Pulse className="h-4 w-36" />
          <Pulse className="h-44 w-full rounded-3xl" />
          <Pulse className="h-32 w-full rounded-3xl" />
          <Pulse className="h-28 w-full rounded-3xl" />
          <Pulse className="h-44 w-full rounded-3xl" />
        </div>
      </main>
    );
  }

  return (
    <main className={mainClass}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back nav */}
        <Link
          href={`/reports/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
        >
          ← Back to Test Results
        </Link>

        {/* Hero banner with photo */}
        <div className="relative overflow-hidden rounded-3xl h-44 shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80"
            alt="Medical blood test analysis"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest mb-1">{report.reportName}</p>
            <h1 className="text-2xl font-bold text-white drop-shadow">{test.testName}</h1>
            <p className="text-slate-300 text-xs mt-1">📅 {report.date}</p>
          </div>
        </div>

        {/* Result card — muted, clean */}
        <div className={`rounded-2xl p-6 shadow-sm border ${
          isWithin
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
            : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
        }`}>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Result</p>
              <p className={`text-3xl font-bold ${isWithin ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                {test.value}
                <span className="text-base font-normal ml-1 text-slate-500 dark:text-slate-400">{test.unit}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reference</p>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{test.referenceRange || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</p>
              {test.status ? (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isWithin
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                }`}>
                  {isWithin ? "✓ Within Range" : "⚠ Outside Range"}
                </span>
              ) : (
                <span className="text-slate-400 text-sm">—</span>
              )}
            </div>
          </div>
        </div>

        {/* About this test */}
        {description && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">About This Test</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
          </div>
        )}

        {/* AI Explanation */}
        <ExplanationSection reportId={id} testId={testId} />

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-4">
          For educational purposes only — not a medical diagnosis.
        </p>
      </div>
    </main>
  );
}
