import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { normalizeReportSummary } from "@/lib/reportAdapter";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await connectDB();

    const docs = await Report.find({ userId: user.userId })
      .select(
        "_id reportId reportName reportType reportDate createdAt tests"
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