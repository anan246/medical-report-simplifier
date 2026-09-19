import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function GET(request) {
  try {
    await connectDB();

    const reports = await Report.find({})
      .sort({ createdAt: -1 })
      .lean();

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