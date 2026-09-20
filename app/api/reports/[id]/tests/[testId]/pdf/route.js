import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { normalizeReport } from "@/lib/reportAdapter";
import { getAuthenticatedUser } from "@/lib/auth";

function createPdfDocument({ reportName, reportDate, test, explanation }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  // Top emerald accent line
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 0, pageWidth, 4, "F");

  // Header - Brand & Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(5, 150, 105);
  doc.text("MediLens", margin, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Medical Test Summary & AI Explanation", margin, y + 12);

  // Top right metadata
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const dateStr = reportDate ? `Report Date: ${reportDate}` : `Generated: ${new Date().toLocaleDateString("en-GB")}`;
  doc.text(dateStr, pageWidth - margin, y + 6, { align: "right" });
  if (reportName) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(reportName, pageWidth - margin, y + 11, { align: "right" });
  }

  y += 18;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Test Details Hero Box
  const isWithin = test.status === "Within Range";
  const boxBg = isWithin ? [240, 253, 244] : [254, 243, 199];
  const boxBorder = isWithin ? [167, 243, 208] : [253, 230, 138];

  doc.setFillColor(boxBg[0], boxBg[1], boxBg[2]);
  doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(test.testName || "Medical Test", margin + 6, y + 9);

  // 3 Metrics Columns
  const colY = y + 16;
  const col1X = margin + 6;
  const col2X = margin + 62;
  const col3X = margin + 118;

  // 1. Result Value
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("RESULT", col1X, colY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(isWithin ? 5 : 180, isWithin ? 150 : 83, isWithin ? 105 : 9);
  doc.text(`${test.value ?? "—"}${test.unit ? ` ${test.unit}` : ""}`, col1X, colY + 8);

  // 2. Reference Range
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("REFERENCE RANGE", col2X, colY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(test.referenceRange || "Not specified", col2X, colY + 8);

  // 3. Status
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("STATUS", col3X, colY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  if (test.status) {
    doc.setTextColor(isWithin ? 5 : 180, isWithin ? 150 : 83, isWithin ? 105 : 9);
    doc.text(isWithin ? "✓ Within Range" : "⚠ Outside Range", col3X, colY + 8);
  } else {
    doc.setTextColor(148, 163, 184);
    doc.text("—", col3X, colY + 8);
  }

  y += 42;

  // AI Explanation Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("AI Explanation & Medical Breakdown", margin, y);
  y += 6;

  const cards = [
    { title: "Simple Summary", text: explanation?.summary },
    { title: "What This Test Measures", text: explanation?.whatItMeasures },
    { title: "Understanding Your Result", text: explanation?.resultMeaning },
    { title: "Reference Range Note", text: explanation?.referenceRangeNote },
  ].filter((c) => Boolean(c.text && typeof c.text === "string" && c.text.trim().length > 0));

  for (const card of cards) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const splitLines = doc.splitTextToSize(card.text, contentWidth - 12);
    const cardHeight = 10 + splitLines.length * 4.4 + 3;

    if (y + cardHeight > pageHeight - 35) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(card.title, margin + 6, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(splitLines, margin + 6, y + 12);

    y += cardHeight + 4;
  }

  // Medical Disclaimer box
  const disclaimerHeight = 20;
  if (y + disclaimerHeight > pageHeight - 15) {
    doc.addPage();
    y = 20;
  } else {
    y += 2;
  }

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, disclaimerHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("IMPORTANT MEDICAL DISCLAIMER", margin + 5, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText =
    "This summary is generated for educational and informational purposes to help understand medical laboratory report information. It is not a medical diagnosis, medical advice, or a substitute for professional healthcare guidance. Always consult a qualified physician or healthcare provider regarding any medical condition, questions, or treatment decisions.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, y + 10);

  return doc.output("arraybuffer");
}

export async function POST(request, { params }) {
  const { id, testId } = await params;

  if (!id || !testId) {
    return NextResponse.json({ error: "Report ID and Test ID are required." }, { status: 400 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional if client didn't provide extra payload
  }

  const { explanation } = body;

  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await connectDB();

    // Query report strictly scoped to authenticated user
    let doc = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      doc = await Report.findOne({ _id: id, userId: user.userId }).lean();
    }
    if (!doc) {
      doc = await Report.findOne({ reportId: id, userId: user.userId }).lean();
    }

    if (!doc) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const report = normalizeReport(doc);
    const test = report.tests.find((t) => t.id === testId);

    if (!test) {
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    const pdfBuffer = createPdfDocument({
      reportName: report.reportName,
      reportDate: report.date,
      test,
      explanation: explanation || {},
    });

    const safeTestName = (test.testName || "test").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `MediLens_${safeTestName}_Summary.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[POST /api/reports/:id/tests/:testId/pdf]", err.message);
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  }
}
