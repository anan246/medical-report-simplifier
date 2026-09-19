"use client";

import { useState } from "react";

/**
 * STATUS badge config — colour-coded but no medical diagnosis wording.
 * Labels are neutral descriptors only.
 */
const STATUS_CONFIG = {
  normal:   { label: "Normal",   classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-700" },
  low:      { label: "Low",      classes: "bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300  ring-1 ring-amber-200  dark:ring-amber-700"  },
  high:     { label: "High",     classes: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-700" },
  critical: { label: "Critical", classes: "bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300    ring-1 ring-red-200    dark:ring-red-700"    },
};

/**
 * Derive a card-level status badge from all test statuses.
 * Picks the worst status: critical > high > low > normal.
 */
function deriveOverallStatus(tests) {
  const priority = ["critical", "high", "low", "normal"];
  for (const p of priority) {
    if (tests.some((t) => t.status === p)) return p;
  }
  return "normal";
}

/**
 * @param {object} props
 * @param {import("@/types/report").Report} props.report
 * @param {boolean} props.isSelected
 * @param {boolean} props.selectionDisabled  — true when 2 already selected and this isn't one
 * @param {(id: string) => void} props.onToggleSelect
 */
export default function ReportCard({
  report,
  isSelected,
  selectionDisabled,
  onToggleSelect,
}) {
  const [expanded, setExpanded] = useState(false);

  const overall = deriveOverallStatus(report.tests);
  const statusCfg = STATUS_CONFIG[overall] ?? STATUS_CONFIG.normal;
  const testCount = report.tests.length;
  const abnormalCount = report.tests.filter(
    (t) => t.status && t.status !== "normal"
  ).length;

  const dateFormatted = report.reportDate
    ? new Date(report.reportDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <article
      className={[
        "group relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-white dark:bg-slate-800/60",
        isSelected
          ? "border-teal-500 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500/40"
          : selectionDisabled
          ? "border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
          : "border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:shadow-md dark:hover:border-teal-500",
      ].join(" ")}
    >
      {/* Selection stripe */}
      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-teal-500 rounded-l-2xl" />
      )}

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Checkbox */}
            <button
              id={`select-report-${report.reportId}`}
              aria-label={`${isSelected ? "Deselect" : "Select"} ${report.reportName} for comparison`}
              disabled={selectionDisabled}
              onClick={() => !selectionDisabled && onToggleSelect(report.reportId)}
              className={[
                "mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all",
                isSelected
                  ? "bg-teal-500 border-teal-500 text-white"
                  : selectionDisabled
                  ? "border-slate-300 dark:border-slate-600 cursor-not-allowed"
                  : "border-slate-300 dark:border-slate-600 hover:border-teal-400 cursor-pointer",
              ].join(" ")}
            >
              {isSelected && (
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 dark:text-slate-50 truncate text-base leading-snug">
                {report.reportName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {report.reportType} · {dateFormatted}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`text-sm font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusCfg.classes}`}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {testCount}
            </span>{" "}
            {testCount === 1 ? "test" : "tests"}
          </span>
          {abnormalCount > 0 && (
            <span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {abnormalCount}
              </span>{" "}
              out of range
            </span>
          )}
          {report.originalFile?.filename && (
            <span className="truncate max-w-[120px]" title={report.originalFile.filename}>
              📄 {report.originalFile.filename}
            </span>
          )}
        </div>

        {/* AI Summary — collapsible */}
        {report.aiSummary && (
          <div className="mt-3">
            <p
              className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${
                !expanded ? "line-clamp-2" : ""
              }`}
            >
              {report.aiSummary}
            </p>
            {report.aiSummary.length > 120 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-1 text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
