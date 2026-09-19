import { NextResponse } from "next/server";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { extractTextFromFile } from "@/lib/extractText";
import { extractMedicalReport } from "@/services/geminiService";
import { getAuthenticatedUser } from "@/lib/auth";

// Gemini has a ~1M token limit but large text slows it down — cap at 50k chars
const MAX_TEXT_LENGTH = 50000;

export async function POST(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const body = await request.json();
    const { reportId, mimeType } = body;

    if (!reportId || !mimeType) {
      return NextResponse.json(
        { success: false, message: "reportId and mimeType are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const report = await Report.findOne({ reportId, userId: user.userId });
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    const storedFilename = report.fileUrl?.split("/").pop();
    if (!storedFilename || storedFilename.includes("..") || !/^[\w.-]+$/.test(storedFilename)) {
      return NextResponse.json(
        { success: false, message: "Report file is unavailable." },
        { status: 422 }
      );
    }

    const storageRoot = report.fileUrl.startsWith("/api/reports/files/")
      ? path.join(process.cwd(), "storage", "uploads")
      : path.join(process.cwd(), "public", "uploads");
    const absolutePath = path.join(storageRoot, storedFilename);

    // Extract text content from file
    let reportText = "";
    try {
      reportText = await extractTextFromFile(absolutePath, mimeType);
    } catch (err) {
      console.error("[analyze] text extraction error:", err.message);
      return NextResponse.json(
        { success: false, message: `Content extraction failed: ${err.message}` },
        { status: 422 }
      );
    }

    console.log("[analyze] extracted text length:", reportText.length);
    console.log("[analyze] text preview:", reportText.slice(0, 300));

    if (!reportText || reportText.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: "Could not extract readable text from this PDF. It may be a scanned/image-based PDF. Please upload a PNG or JPG instead." },
        { status: 422 }
      );
    }

    // Truncate if too large
    if (reportText.length > MAX_TEXT_LENGTH) {
      console.log(`[analyze] truncating text from ${reportText.length} to ${MAX_TEXT_LENGTH} chars`);
      reportText = reportText.slice(0, MAX_TEXT_LENGTH);
    }

    // Send to Gemini
    let geminiResult;
    try {
      geminiResult = await extractMedicalReport(absolutePath, mimeType, reportText);
    } catch (err) {
      console.error("[analyze] gemini error:", err.message);
      return NextResponse.json(
        { success: false, message: `AI processing failed: ${err.message}` },
        { status: 422 }
      );
    }

    console.log("[analyze] extracted tests count:", geminiResult.tests.length);

    // Save to MongoDB
    try {
      report.tests = geminiResult.tests;
      report.aiSummary = geminiResult.aiSummary;
      report.reportType = geminiResult.reportType;
      report.updatedAt = new Date();
      await report.save();
    } catch (err) {
      console.error("[analyze] MongoDB save error:", err.message);
      return NextResponse.json(
        { success: false, message: `Failed to save report: ${err.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId,
      reportName: report.reportName,
      reportType: report.reportType,
      reportDate: report.reportDate,
      fileUrl: report.fileUrl,
      tests: report.tests,
      aiSummary: report.aiSummary,
      createdAt: report.createdAt,
    });

  } catch (err) {
    console.error("[/api/reports/analyze] unhandled error:", err.message, err.stack);
    return NextResponse.json(
      { success: false, message: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
