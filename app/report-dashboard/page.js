"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse ${className}`} />;
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#rg)" />
      <path d="M13 12h9l5 5v11a1 1 0 01-1 1H13a1 1 0 01-1-1V13a1 1 0 011-1z" fill="white" fillOpacity=".9" />
      <path d="M22 12v5h5" fill="none" stroke="white" strokeOpacity=".6" strokeWidth="1.5" />
      <path d="M16 20h8M16 23h5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");
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
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 shadow-xl shadow-emerald-200 dark:shadow-emerald-950">
          {/* decorative blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-5">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-inner">
              🏥
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Medical Reports
              </h1>
              <p className="mt-1 text-emerald-100 text-sm">
                View, explore and understand your health data with AI
              </p>
            </div>
          </div>
        </div>

        {/* Loading skeletons */}
        {status === "loading" && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <Pulse className="w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-48" />
                  <Pulse className="h-3 w-32" />
                </div>
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-sm text-center space-y-4">
            <div className="text-5xl">😕</div>
            <p className="font-semibold text-slate-900 dark:text-white">Couldn&apos;t load your reports</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">There was a problem connecting to the report service.</p>
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="mt-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-200 dark:shadow-none"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "empty" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm text-center space-y-4">
            <div className="text-6xl">📋</div>
            <p className="font-semibold text-slate-900 dark:text-white text-lg">No reports yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload a medical report to get started.</p>
            <Link
              href="/upload"
              className="inline-block mt-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-200 dark:shadow-none"
            >
              Upload Report →
            </Link>
          </div>
        )}

        {/* Report list */}
        {status === "ok" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"}
              </h2>
            </div>
            {reports.map((r, i) => (
              <Link
                key={r.id}
                href={`/reports/${r.id}`}
                className="group flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-950 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12">
                  <ReportIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {r.reportName}
                  </p>
                  {r.reportType && r.reportType !== "pending" && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{r.reportType}</p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">📅 {r.date}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    r.testCount > 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {r.testCount} {r.testCount === 1 ? "test" : "tests"}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-4">
          For educational purposes only — not a medical diagnosis.
        </p>
      </div>
    </main>
  );
}