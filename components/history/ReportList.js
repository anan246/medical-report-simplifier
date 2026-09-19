"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReportCard from "./ReportCard";
import { getReports } from "@/lib/api";

/** Skeleton card for loading state */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
      </div>
    </div>
  );
}

/** Empty state illustration */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
        No reports yet
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        Upload your first medical report to begin tracking your health trends over time.
      </p>
    </div>
  );
}

/** Filter bar */
function FilterBar({ search, onSearch, typeFilter, onTypeFilter, types }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          id="report-search"
          type="text"
          placeholder="Search reports…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition"
        />
      </div>
      <select
        id="report-type-filter"
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
        className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300
                   focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition"
      >
        <option value="">All types</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

export default function ReportList() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);   // max 2 reportIds
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    getReports()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
        );
        setReports(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleSelect(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function handleCompare() {
    if (selected.length === 2) {
      router.push(`/compare?a=${selected[0]}&b=${selected[1]}`);
    }
  }

  const allTypes = [...new Set(reports.map((r) => r.reportType))];

  const filtered = reports.filter((r) => {
    const matchSearch =
      !search ||
      r.reportName.toLowerCase().includes(search.toLowerCase()) ||
      r.reportType.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.reportType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      {!loading && reports.length > 0 && (
        <FilterBar
          search={search}
          onSearch={setSearch}
          typeFilter={typeFilter}
          onTypeFilter={setTypeFilter}
          types={allTypes}
        />
      )}

      {/* Compare banner */}
      {selected.length > 0 && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 px-4 py-3">
          <p className="text-sm text-teal-800 dark:text-teal-200 font-medium">
            {selected.length === 1
              ? "Select one more report to compare"
              : "2 reports selected — ready to compare"}
          </p>
          <div className="flex items-center gap-2">
            <button
              id="clear-selection-btn"
              onClick={() => setSelected([])}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear
            </button>
            {selected.length === 2 && (
              <button
                id="compare-reports-btn"
                onClick={handleCompare}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
              >
                Compare →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 text-sm text-red-700 dark:text-red-300 mb-5">
          Failed to load reports: {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
          ? <EmptyState />
          : filtered.map((report) => (
              <ReportCard
                key={report.reportId}
                report={report}
                isSelected={selected.includes(report.reportId)}
                selectionDisabled={
                  selected.length === 2 && !selected.includes(report.reportId)
                }
                onToggleSelect={toggleSelect}
              />
            ))}
      </div>

      {/* Compare hint */}
      {!loading && reports.length > 0 && selected.length === 0 && (
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Tip: Select two reports using the checkboxes to compare them side-by-side.
        </p>
      )}
    </div>
  );
}
