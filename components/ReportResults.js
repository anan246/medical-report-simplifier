"use client";

import { useState, useMemo } from "react";
import ReadAloud from "@/components/ReadAloud";
import { useTheme } from "@/components/ThemeProvider";

const STATUS_CONFIG = {
  normal: {
    label: "Normal",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  above_range: {
    label: "Above Range",
    className: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  below_range: {
    label: "Below Range",
    className: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  unknown: {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default function ReportResults({ report }) {
  const { language } = useTheme();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const STATUS_CONFIG = {
    normal:      { label: t.results.statusLabels.normal,      className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800", dot: "bg-emerald-500" },
    above_range: { label: t.results.statusLabels.above_range, className: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",   dot: "bg-amber-500" },
    below_range: { label: t.results.statusLabels.below_range, className: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",     dot: "bg-blue-500" },
    unknown:     { label: t.results.statusLabels.unknown,     className: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",  dot: "bg-slate-400" },
  };

  const tests = useMemo(() => (Array.isArray(report?.tests) ? report.tests : []), [report]);
  const normalCount = tests.filter((t) => t.status === "normal").length;
  const aboveCount = tests.filter((t) => t.status === "above_range").length;
  const belowCount = tests.filter((t) => t.status === "below_range").length;
  const unknownCount = tests.filter((t) => t.status === "unknown").length;

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch = String(t.testName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tests, search, statusFilter]);

  if (!report) return null;

  const filterButtons = [
    { key: "all",         label: `${t.results.filterAll} (${tests.length})` },
    { key: "normal",      label: `${t.results.filterNormal} (${normalCount})` },
    { key: "above_range", label: `${t.results.filterAbove} (${aboveCount})` },
    { key: "below_range", label: `${t.results.filterBelow} (${belowCount})` },
    { key: "unknown",     label: `${t.results.filterUnknown} (${unknownCount})` },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* Header card */}
      <div className="animate-fade-up bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {report.reportName}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {report.reportType}
              {report.reportDate && (
                <> &middot; {new Date(report.reportDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="text-center px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{tests.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total</p>
            </div>
            <div className="text-center px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{normalCount}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Normal</p>
            </div>
            <div className="text-center px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{aboveCount}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Above</p>
            </div>
            <div className="text-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{belowCount}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Below</p>
            </div>
          </div>
        </div>

        {report.aiSummary && (
          <div className="mt-4 p-4 bg-[#f7fbf8] dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Report Summary
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {report.aiSummary}
            </p>
            <ReadAloud text={report.aiSummary} language={language} />
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
              Information summary only — not a medical diagnosis or advice. Consult a qualified healthcare professional.
            </p>
          </div>
        )}
      </div>

      {/* Search + Filter — only when tests exist */}
      {tests.length > 0 && (
        <div className="animate-fade-up delay-100 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setStatusFilter(btn.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === btn.key
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tests table */}
      <div className="animate-fade-up delay-200 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Test Results ({filteredTests.length}{filteredTests.length !== tests.length ? ` of ${tests.length}` : ""})
          </h3>
        </div>

        {tests.length === 0 && (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No lab test values found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              This appears to be a narrative report rather than a lab results report. See the summary above.
            </p>
          </div>
        )}

        {tests.length > 0 && filteredTests.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-400">No tests match your search or filter.</p>
          </div>
        )}

        {filteredTests.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Test Name</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Value</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Unit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Reference Range</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Voice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTests.map((test, idx) => (
                    <tr
                      key={test.testId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${idx * 25}ms both` }}
                    >
                      <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{test.testName}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {test.value !== 0 ? test.value : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{test.unit || "—"}</td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-xs">{test.referenceRange || "N/A"}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={test.status} /></td>
                      <td className="px-4 py-3.5"><ReadAloud text={`${test.testName}: ${test.value} ${test.unit}. Reference range: ${test.referenceRange || "not provided"}. Status: ${test.status || "not specified"}.`} language={language} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTests.map((test, idx) => (
                <div
                  key={test.testId}
                  className="px-4 py-4 space-y-2"
                  style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${idx * 25}ms both` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{test.testName}</p>
                    <StatusBadge status={test.status} />
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {test.value !== 0 ? test.value : "—"}
                      </span>{" "}
                      {test.unit || ""}
                    </span>
                    <span>Ref: {test.referenceRange || "N/A"}</span>
                  </div>
                  <ReadAloud text={`${test.testName}: ${test.value} ${test.unit}. Reference range: ${test.referenceRange || "not provided"}. Status: ${test.status || "not specified"}.`} language={language} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 pb-4">
        MediLens extracts and simplifies report data. Always consult a qualified healthcare professional for medical advice.
      </p>
    </div>
  );
}
