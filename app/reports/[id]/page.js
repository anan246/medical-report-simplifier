"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

function StatusBadge({ status }) {
  const isWithin = status === "Within Range";
  if (!status) return <span className="text-sm text-slate-400 dark:text-slate-500">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isWithin
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
    }`}>
      {isWithin ? "✓ Within Range" : "⚠ Outside Range"}
    </span>
  );
}

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse ${className}`} />;
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border ${color.border} ${color.bg}`}>
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 ${color.blob}`} />
      <p className={`text-xs font-semibold uppercase tracking-wider ${color.label}`}>{label}</p>
      <div className="flex items-end gap-2 mt-2">
        <p className={`text-4xl font-bold ${color.value}`}>{value}</p>
        <span className="text-2xl mb-0.5">{icon}</span>
      </div>
    </div>
  );
}

export default function ReportTestsPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function run() {
      setStatus("loading");
      setReport(null);
      try {
        const res = await fetch(`/api/reports/${id}`);
        if (cancelled) return;
        if (res.status === 404) { setStatus("notfound"); return; }
        if (!res.ok) { setStatus("error"); return; }
        const data = await res.json();
        if (cancelled) return;
        setReport(data);
        setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id, retryCount]);

  const tests = report?.tests ?? [];
  const withinCount = tests.filter((t) => t.status === "Within Range").length;
  const outsideCount = tests.filter((t) => t.status === "Outside Range").length;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          href="/report-dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
        >
          ← Back to My Reports
        </Link>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl h-48 sm:h-56 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80"
            alt="Medical test tubes and lab equipment"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-emerald-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-end px-8 pb-7">
            {status === "ok" && report ? (
              <div>
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-1">{report.reportType && report.reportType !== "pending" ? report.reportType : "Medical Report"}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">{report.reportName}</h1>
                <p className="text-emerald-100 text-sm mt-1">📅 {report.date}</p>
              </div>
            ) : (
              <div>
                <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-1">MediLens</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">Test Results</h1>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <Pulse key={i} className="h-24" />)}
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-5 py-4 flex gap-4 border-b border-slate-100 dark:border-slate-800">
                  <Pulse className="h-4 flex-1" />
                  <Pulse className="h-4 w-20" />
                  <Pulse className="h-4 w-24" />
                  <Pulse className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not found */}
        {status === "notfound" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm text-center space-y-4">
            <div className="text-6xl">🔍</div>
            <p className="font-semibold text-slate-900 dark:text-white text-lg">Report not found</p>
            <Link href="/report-dashboard" className="inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">
              ← Back to My Reports
            </Link>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-sm text-center space-y-4">
            <div className="text-5xl">😕</div>
            <p className="font-semibold text-slate-900 dark:text-white">Couldn&apos;t load this report</p>
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loaded */}
        {status === "ok" && report && (
          <>
            {/* Summary stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total Tests" value={tests.length} icon="🧪"
                color={{ bg: "bg-white dark:bg-slate-900", border: "border-slate-200 dark:border-slate-800", blob: "bg-slate-400", label: "text-slate-500 dark:text-slate-400", value: "text-slate-900 dark:text-white" }}
              />
              <StatCard label="Within Range" value={withinCount} icon="✅"
                color={{ bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900", blob: "bg-emerald-400", label: "text-emerald-600 dark:text-emerald-400", value: "text-emerald-700 dark:text-emerald-400" }}
              />
              <StatCard label="Outside Range" value={outsideCount} icon="⚠️"
                color={{ bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-900", blob: "bg-amber-400", label: "text-amber-600 dark:text-amber-400", value: "text-amber-700 dark:text-amber-400" }}
              />
            </div>

            {/* Test results table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Test Results</h2>
                  {tests.length > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tap any test for details and AI explanation ✨</p>
                  )}
                </div>
                {outsideCount > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    {outsideCount} flagged
                  </span>
                )}
              </div>

              {tests.length === 0 ? (
                <div className="px-6 py-12 text-center space-y-2">
                  <div className="text-4xl">📭</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">No test results available yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        {["Test", "Result", "Reference Range", "Status"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {tests.map((test) => (
                        <tr key={test.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors group">
                          <td className="px-5 py-4 font-medium">
                            <Link
                              href={`/reports/${report.id}/tests/${test.id}`}
                              className="text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                            >
                              {test.testName}
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-slate-700 dark:text-slate-300 font-mono whitespace-nowrap">
                            {test.value} <span className="text-slate-400 font-sans text-xs">{test.unit}</span>
                          </td>
                          <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {test.referenceRange || "—"}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <StatusBadge status={test.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-4">
          For educational purposes only — not a medical diagnosis.
        </p>
      </div>
    </main>
  );
}
