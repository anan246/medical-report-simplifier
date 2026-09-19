"use client";

import { useState } from "react";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
}

function formatValue(value, unit) {
  return `${value ?? "—"}${unit ? ` ${unit}` : ""}`;
}

function getStatusChange(row) {
  if (row.statusA === row.statusB || !row.statusA || !row.statusB) return null;
  if (row.statusA !== "normal" && row.statusB === "normal") return "improved";
  if (row.statusA === "normal" && row.statusB !== "normal") return "attention";
  return null;
}

function buildSection(title, rows, text) {
  if (!rows.length) return "";
  return `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><ul>${rows
    .map((row) => `<li><strong>${escapeHtml(row.testName)}</strong>: ${escapeHtml(formatValue(row.valueA, row.unit))} to ${escapeHtml(formatValue(row.valueB, row.unit))}${row.delta !== null ? ` (${row.delta > 0 ? "+" : ""}${escapeHtml(row.delta)})` : ""}.</li>`)
    .join("")}</ul></section>`;
}

/**
 * Download a dependency-free HTML comparison summary.
 *
 * @param {object} props
 * @param {import("@/types/report").Report} props.reportA
 * @param {import("@/types/report").Report} props.reportB
 * @param {import("@/types/report").ComparisonRow[]} props.comparison
 */
export default function DownloadSummary({ reportA, reportB, comparison }) {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "done" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDownload() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const improved = comparison.filter((row) => getStatusChange(row) === "improved");
      const attention = comparison.filter((row) => getStatusChange(row) === "attention");
      const increased = comparison.filter((row) => row.trend === "increased");
      const decreased = comparison.filter((row) => row.trend === "decreased");
      const unchanged = comparison.filter((row) => row.trend === "unchanged");

      const tableRows = comparison.map((row) => `<tr><td>${escapeHtml(row.testName)}</td><td>${escapeHtml(formatValue(row.valueA, row.unit))}</td><td>${escapeHtml(row.trend)}</td><td>${escapeHtml(formatValue(row.valueB, row.unit))}</td><td>${row.delta === null ? "—" : escapeHtml(`${row.delta > 0 ? "+" : ""}${row.delta}`)}</td><td>${escapeHtml(row.statusA || "—")} → ${escapeHtml(row.statusB || "—")}</td></tr>`).join("");
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>MediLens Comparison Summary</title><style>
        body{font-family:Arial,sans-serif;color:#1e293b;max-width:1000px;margin:40px auto;padding:0 24px;line-height:1.5}h1{color:#0f766e}h2{margin-top:28px;color:#334155}p{color:#475569}section{border-top:1px solid #cbd5e1;padding-top:8px}table{border-collapse:collapse;width:100%;margin-top:12px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#f1f5f9}li{margin:6px 0}.note{font-size:12px;color:#64748b}
      </style></head><body><h1>MediLens Report Comparison Summary</h1><p>Comparing <strong>${escapeHtml(reportA.reportName)}</strong> (${escapeHtml(formatDate(reportA.reportDate))}) with <strong>${escapeHtml(reportB.reportName)}</strong> (${escapeHtml(formatDate(reportB.reportDate))}).</p>
      ${buildSection("What improved", improved, "These tests moved from a non-normal status to normal status. This is a status change only, not a diagnosis.")}
      ${buildSection("What needs attention", attention, "These tests moved from normal status to a non-normal status. Review the underlying values with a qualified clinician.")}
      ${buildSection("Numeric changes", [...increased, ...decreased], "The following values changed numerically. An increase or decrease is reported objectively and is not automatically better or worse.")}
      ${buildSection("What stayed unchanged", unchanged, "These tests had no detected numeric change or remained the same text value.")}
      <section><h2>Detailed comparison table</h2><table><thead><tr><th>Test</th><th>Earlier</th><th>Trend</th><th>Later</th><th>Change</th><th>Status</th></tr></thead><tbody>${tableRows}</tbody></table></section><p class="note">Generated ${escapeHtml(formatDate(new Date()))}. This summary reports objective differences and does not provide medical advice.</p></body></html>`;
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MediLens_Comparison_${reportA.reportDate?.replace(/-/g, "") || "earlier"}_vs_${reportB.reportDate?.replace(/-/g, "") || "later"}.html`;
      link.click();
      URL.revokeObjectURL(url);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[DownloadSummary]", err);
      setErrorMsg(err.message || "Summary generation failed.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        id="download-summary-btn"
        onClick={handleDownload}
        disabled={status === "loading" || !comparison?.length}
        className={[
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          status === "loading"
            ? "bg-teal-400 text-white cursor-wait opacity-80"
            : status === "done"
            ? "bg-emerald-500 text-white"
            : status === "error"
            ? "bg-red-500 text-white"
            : !comparison?.length
            ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-teal-600 hover:bg-teal-700 active:scale-95 text-white shadow-sm hover:shadow-md",
        ].join(" ")}
      >
        {status === "loading" && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === "done" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "error" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {status === "idle" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        {status === "loading"
          ? "Preparing summary…"
          : status === "done"
          ? "Downloaded!"
          : status === "error"
          ? "Failed — Retry"
          : "Download Summary"}
      </button>

      {status === "error" && errorMsg && (
        <p className="text-xs text-red-500 dark:text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
