"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Pulse({ className }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse ${className}`} />;
}

function ReportIcon() {
  return (
    <div className="w-full h-full rounded-2xl bg-linear-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-inner">
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
        <path d="M7 3.75h6.25L18 8.5v11.75H7a1 1 0 0 1-1-1V4.75a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 3.75V9h5M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      setStatus("loading");
      setReports([]);

      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (cancelled) return;
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          setStatus("error");
          return;
        }

        const data = await response.json();
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          setStatus("empty");
          return;
        }

        setReports(data);
        setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadReports();
    return () => {
      cancelled = true;
    };
  }, [retryCount, router]);

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 to-teal-500 p-8 shadow-xl shadow-emerald-200 dark:shadow-emerald-950">
          <div className="relative flex items-center gap-5">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-inner" aria-hidden="true">
              +
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

        {status === "loading" && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <Pulse className="w-12 h-12 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-48" />
                  <Pulse className="h-3 w-32" />
                </div>
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-sm text-center space-y-4">
            <p className="font-semibold text-slate-900 dark:text-white">Could not load your reports</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">There was a problem connecting to the report service.</p>
            <button
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-200 dark:shadow-none"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "empty" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm text-center space-y-4">
            <p className="font-semibold text-slate-900 dark:text-white text-lg">No reports yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload a medical report to get started.</p>
            <Link href="/upload" className="inline-block mt-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-200 dark:shadow-none">
              Upload Report
            </Link>
          </div>
        )}

        {status === "ok" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"}
              </h2>
              <Link href="/upload" className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
                Upload new
              </Link>
            </div>
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="group flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-950 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200"
              >
                <div className="shrink-0 w-12 h-12">
                  <ReportIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {report.reportName}
                  </p>
                  {report.reportType && report.reportType !== "pending" && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{report.reportType}</p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{report.date}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${report.testCount > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                    {report.testCount} {report.testCount === 1 ? "test" : "tests"}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">
                    View
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-4">
          For educational purposes only - not a medical diagnosis.
        </p>
      </div>
    </main>
  );
}
