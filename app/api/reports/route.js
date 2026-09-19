import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { normalizeReportSummary } from "@/lib/reportAdapter";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? null;

    const query = userId ? { userId } : {};

    const docs = await Report.find(query)
      .select(
        "_id reportId userId reportName reportType reportDate createdAt tests"
      )
      .sort({ createdAt: -1 })
      .lean();

    const reports = docs.map(normalizeReportSummary).filter(Boolean);

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("[GET /api/reports]", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reports",
        details: error.message,
      },
      { status: 500 }
    );
  }
}