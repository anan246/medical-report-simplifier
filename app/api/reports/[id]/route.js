import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { normalizeReport } from "../../../../lib/reportAdapter";

// Real DB/collection confirmed from Atlas inspection
const DB_NAME = "test";
const COLLECTION = "reports";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Support both ObjectId and string-based IDs
    let doc = null;
    if (ObjectId.isValid(id)) {
      doc = await collection.findOne({ _id: new ObjectId(id) });
    }
    // Fallback: try matching a string "id" field if ObjectId lookup failed
    if (!doc) {
      doc = await collection.findOne({ id });
    }

    if (!doc) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    // Convert ObjectId to string before normalizing (plain object required)
    const plain = JSON.parse(JSON.stringify(doc));
    const report = normalizeReport(plain);

    return NextResponse.json(report);
  } catch (err) {
    console.error("[GET /api/reports/:id]", err.message);
    return NextResponse.json(
      { error: "Failed to load report." },
      { status: 500 }
    );
  }
}
