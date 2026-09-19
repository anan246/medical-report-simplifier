import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Report from "../../../../models/Report";
import { normalizeReport } from "../../../../lib/reportAdapter";
import { getAuthenticatedUser } from "../../../../lib/auth";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await connectDB();

    // Try MongoDB _id (24-char hex ObjectId) first, then reportId (UUID)
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

    return NextResponse.json(normalizeReport(doc));
  } catch (err) {
    console.error("[GET /api/reports/:id]", err.message);
    return NextResponse.json({ error: "Failed to load report." }, { status: 500 });
  }
}
