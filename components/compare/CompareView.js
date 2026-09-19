"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { compareReports } from "@/lib/api";
import CompareTable from "@/components/compare/CompareTable";
import DownloadSummary from "@/components/compare/DownloadSummary";

/** Skeleton for the compare page loading state */
function CompareSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-12" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small stat card for the report header strip */
function ReportHeaderCard({ report, label }) {
  const dateFormatted = report.reportDate
    ? new Date(report.reportDate).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const abnormal = report.tests.filter(
    (t) => t.status && t.status !== "normal"
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
        {label}
      </p>
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 leading-snug">
        {report.reportName}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {report.reportType} · {dateFormatted}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {report.tests.length}
          </span>{" "}
          tests
        </span>
        {abnormal > 0 && (
          <span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {abnormal}
            </span>{" "}
            out of range
          </span>
        )}
      </div>
    </div>
  );
}

/** Summary trend pills above the table */
function TrendSummary({ comparison }) {
  const increased = comparison.filter((r) => r.trend === "increased").length;
  const decreased = comparison.filter((r) => r.trend === "decreased").length;
  const unchanged = comparison.filter((r) => r.trend === "unchanged").length;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {increased > 0 && (
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-700">
          ▲ {increased} increased
        </span>
      )}
      {decreased > 0 && (
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-700">
          ▼ {decreased} decreased
        </span>
      )}
      {unchanged > 0 && (
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-600">
          ◼ {unchanged} unchanged
        </span>
      )}
      <span className="text-xs text-slate-400 dark:text-slate-500 self-center">
        · {comparison.length} matching tests
      </span>
    </div>
  );
}

/**
 * CompareView — Client Component.
 * Receives idA and idB as props (passed from the Server Component page).
 *
 * @param {{ idA: string|null, idB: string|null }} props
 */
export default function CompareView({ idA, idB }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idA || !idB) {
      router.replace("/history");
      return;
    }
    if (idA === idB) {
      setError("Cannot compare a report with itself. Please select two different reports.");
      setLoading(false);
      return;
    }

    compareReports(idA, idB)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idA, idB, router]);

  return (
    <>
      {/* Back link + header */}
      <div className="mb-7">
        <button
          id="back-to-history-btn"
          onClick={() => router.push("/history")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition mb-4"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Report History
        </button>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Compare Reports
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Objective trend comparison — no medical diagnosis
              </p>
            </div>
          </div>

          {/* Download button — top right */}
          {data && (
            <DownloadSummary
              reportA={data.reportA}
              reportB={data.reportB}
              comparison={data.comparison}
            />
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && <CompareSkeleton />}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-5 text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold mb-1">Could not load comparison</p>
          <p className="text-xs">{error}</p>
          <button
            onClick={() => router.push("/history")}
            className="mt-3 text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            ← Go back to history
          </button>
        </div>
      )}

      {/* Success */}
      {data && (
        <div className="space-y-5">
          {/* Report A / B header cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReportHeaderCard report={data.reportA} label="Report A (Earlier)" />
            <ReportHeaderCard report={data.reportB} label="Report B (Later)" />
          </div>

          {/* Trend summary pills */}
          <TrendSummary comparison={data.comparison} />

          {/* Diff table */}
          <CompareTable
            comparison={data.comparison}
            reportA={data.reportA}
            reportB={data.reportB}
          />

          {/* Bottom download CTA */}
          <div className="flex justify-end pt-2">
            <DownloadSummary
              reportA={data.reportA}
              reportB={data.reportB}
              comparison={data.comparison}
            />
          </div>
        </div>
      )}
    </>
  );
}
