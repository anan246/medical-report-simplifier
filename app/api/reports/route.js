import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { normalizeReportSummary } from "../../../lib/reportAdapter";

const DB_NAME = "test";
const COLLECTION = "reports";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // ---------------------------------------------------------------------------
    // User filtering: once Person 1 adds auth, replace "anonymous" with the real
    // userId from the session/token. For now we return all reports so the demo
    // works without authentication.
    // ---------------------------------------------------------------------------
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? null;

    const query = userId ? { userId } : {};

    // Return lightweight summaries — exclude the full tests array to keep the
    // list response small. Tests are fetched only when a report is selected.
    const docs = await collection
      .find(query, {
        projection: {
          _id: 1,
          reportId: 1,
          userId: 1,
          reportName: 1,
          reportType: 1,
          reportDate: 1,
          createdAt: 1,
          // Include tests only to get the count; we strip the content in the adapter
          tests: 1,
        },
      })
      .sort({ createdAt: -1 })
      .toArray();

    const plain = JSON.parse(JSON.stringify(docs));
    const reports = plain.map(normalizeReportSummary).filter(Boolean);

    return NextResponse.json(reports);
  } catch (err) {
    console.error("[GET /api/reports]", err.message);
    return NextResponse.json(
      { error: "Failed to load reports." },
      { status: 500 }
    );
  }
}
