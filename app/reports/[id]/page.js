"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function StatusBadge({ status }) {
  const isWithin = status === "Within Range";
  if (!status) return <span className="text-sm text-slate-400 dark:text-slate-500">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isWithin
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    }`}>
      {isWithin ? "✓ Within Range" : "⚠ Outside Range"}
    </span>
  );
}

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />;
}

export default function ReportTestsPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | notfound | ok
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
    <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Loading */}
        {status === "loading" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start gap-4">
              <Pulse className="flex-shrink-0 w-10 h-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Pulse className="h-3 w-16" />
                <Pulse className="h-5 w-56" />
                <Pulse className="h-3 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
                  <Pulse className="h-3 w-24" />
                  <Pulse className="h-8 w-12" />
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                <Pulse className="h-4 w-28" />
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-5 py-4 grid grid-cols-4 gap-4">
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-3/4" />
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Not found */}
        {status === "notfound" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-sm text-center space-y-3">
            <p className="text-3xl">🔍</p>
            <p className="font-medium text-slate-900 dark:text-white">Report not found.</p>
            <Link
              href="/dashboard"
              className="inline-block text-sm text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm text-center space-y-3">
            <p className="font-medium text-slate-900 dark:text-white">
              Unable to load this report.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              There was a problem retrieving the report data.
            </p>
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loaded */}
        {status === "ok" && report && (
          <>
            {/* Report info card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-lg">
                🩺
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                  Report
                </p>
                <h1 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
                  {report.reportName}
                </h1>
                {report.reportType && report.reportType !== "pending" && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {report.reportType}
                  </p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  {report.date}
                </p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                  Total Tests
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {tests.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                  Within Range
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  {withinCount}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                  Outside Range
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {outsideCount}
                </p>
              </div>
            </div>

            {/* Test results table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Test Results
                </h2>
                {tests.length > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click a test to view details and AI explanation.
                  </p>
                )}
              </div>

              {tests.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Test results are not available for this report yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        {["Test", "Result", "Reference Range", "Status"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {tests.map((test) => (
                        <tr
                          key={test.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-5 py-4 font-medium whitespace-nowrap">
                            <Link
                              href={`/reports/${report.id}/tests/${test.id}`}
                              className="text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                            >
                              {test.testName}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {test.value} {test.unit}
                          </td>
                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
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

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pb-4">
          This dashboard presents information extracted from your medical report and is not a medical diagnosis.
        </p>

      </div>
    </main>
  );
}
