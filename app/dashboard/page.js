"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />;
}

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | empty | ok
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("loading");
      setReports([]);
      try {
        const res = await fetch("/api/reports");
        if (cancelled) return;
        if (!res.ok) { setStatus("error"); return; }
        const data = await res.json();
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) { setStatus("empty"); return; }
        setReports(data);
        setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    run();
    return () => { cancelled = true; };
  }, [retryCount]);

  return (
    <main className="min-h-screen bg-[#f7fbf8] dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Report Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Select a report to view its test results.
          </p>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
                <Pulse className="h-4 w-56" />
                <Pulse className="h-3 w-40" />
                <Pulse className="h-3 w-28" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm text-center space-y-3">
            <p className="font-medium text-slate-900 dark:text-white">
              Unable to load your reports.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              There was a problem connecting to the report service.
            </p>
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "empty" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm text-center space-y-2">
            <p className="font-medium text-slate-900 dark:text-white">No reports found.</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Upload a medical report to get started.
            </p>
          </div>
        )}

        {/* Report list */}
        {status === "ok" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Your Reports
              </h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/reports/${r.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-base mt-0.5">
                        🩺
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {r.reportName}
                        </p>
                        {r.reportType && r.reportType !== "pending" && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {r.reportType}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {r.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r.testCount > 0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {r.testCount} {r.testCount === 1 ? "test" : "tests"}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        View →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pb-4">
          This dashboard presents information extracted from your medical report and is not a medical diagnosis.
        </p>

      </div>
    </main>
  );
}
