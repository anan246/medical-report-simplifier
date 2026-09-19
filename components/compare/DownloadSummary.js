"use client";

import { useState } from "react";

/**
 * DownloadSummary — Reusable PDF export component.
 *
 * Uses jsPDF and jspdf-autotable to build a PDF document directly
 * from the data, bypassing HTML canvas capture issues (like Tailwind v4 oklch colors).
 *
 * Usage:
 *   <DownloadSummary reportA={reportA} reportB={reportB} comparison={comparison} />
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
      // Dynamically import to keep bundle lean
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 14;

      // ---- Header ----
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(15, 118, 110); // teal-700
      pdf.text("MediLens — Report Comparison Summary", margin, margin + 4);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text(
        `Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`,
        margin,
        margin + 10
      );

      // ---- Report Info ----
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59); // slate-800
      const col1 = margin;
      const col2 = pdf.internal.pageSize.getWidth() / 2 + margin / 2;

      pdf.setFont("helvetica", "bold");
      pdf.text("Report A (Earlier)", col1, margin + 20);
      pdf.text("Report B (Later)", col2, margin + 20);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105); // slate-600
      
      pdf.text(reportA.reportName, col1, margin + 26);
      pdf.text(
        new Date(reportA.reportDate).toLocaleDateString("en-IN", { dateStyle: "medium" }),
        col1,
        margin + 31
      );
      
      pdf.text(reportB.reportName, col2, margin + 26);
      pdf.text(
        new Date(reportB.reportDate).toLocaleDateString("en-IN", { dateStyle: "medium" }),
        col2,
        margin + 31
      );

      // ---- Table ----
      
      // Map trends to simple characters or text for the PDF
      const trendSymbols = {
        increased: "Up",
        decreased: "Down",
        unchanged: "-",
      };

      const tableData = comparison.map(row => [
        row.testName,
        `${row.valueA} ${row.unit || ""}`,
        trendSymbols[row.trend] || "-",
        `${row.valueB} ${row.unit || ""}`,
        row.delta !== null ? (row.delta > 0 ? `+${row.delta}` : row.delta) : "-",
        row.referenceRange || "-"
      ]);

      autoTable(pdf, {
        startY: margin + 38,
        head: [["Test", "Report A", "Trend", "Report B", "Change", "Reference"]],
        body: tableData,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [248, 250, 252], // slate-50
            textColor: [100, 116, 139], // slate-500
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { fontStyle: 'bold' },
            2: { halign: 'center' },
            4: { halign: 'center', fontStyle: 'bold' },
        }
      });

      // ---- Footer ----
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184); // slate-400
      
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.text(
          "Trends are objective numerical changes only. This document does not constitute medical advice.",
          margin,
          pageHeight - 8
        );
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
      }

      // ---- Save ----
      const dateA = reportA.reportDate.replace(/-/g, "");
      const dateB = reportB.reportDate.replace(/-/g, "");
      pdf.save(`MediLens_Comparison_${dateA}_vs_${dateB}.pdf`);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[DownloadSummary]", err);
      setErrorMsg(err.message || "PDF generation failed.");
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
          ? "Generating PDF…"
          : status === "done"
          ? "Downloaded!"
          : status === "error"
          ? "Failed — Retry"
          : "Download Summary PDF"}
      </button>

      {status === "error" && errorMsg && (
        <p className="text-xs text-red-500 dark:text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
