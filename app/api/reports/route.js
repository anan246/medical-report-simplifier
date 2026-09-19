import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Report from "../../../models/Report";
import { normalizeReportSummary } from "../../../lib/reportAdapter";

export async function GET(request) {
  try {
    await connectDB();

    // Optional user filtering.
    // Later, this can be replaced with the authenticated user's ID.
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? null;

    const query = userId ? { userId } : {};

    // Fetch lightweight report information.
    // The tests field is included so the adapter can calculate the test count.
    const docs = await Report.find(query)
      .select(
        "_id reportId userId reportName reportType reportDate createdAt tests"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Convert database documents into the format expected by the frontend.
    const reports = docs.map(normalizeReportSummary).filter(Boolean);

    return NextResponse.json(reports);
  } catch (err) {
    console.error("[GET /api/reports]", err);

    return NextResponse.json(
      { error: "Failed to load reports." },
      { status: 500 }
    );
  }
}