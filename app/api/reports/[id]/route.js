import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Report from "../../../../models/Report";
import { normalizeReport } from "../../../../lib/reportAdapter";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();

    // Try MongoDB _id (24-char hex ObjectId) first, then reportId (UUID)
    let doc = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      doc = await Report.findById(id).lean();
    }
    if (!doc) {
      doc = await Report.findOne({ reportId: id }).lean();
    }

    if (!doc) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json(normalizeReport(doc));
  } catch (err) {
    console.error("[GET /api/reports/:id]", err.message);
    return NextResponse.json({ error: "Failed to load report." }, { status: 500 });
  }
}
