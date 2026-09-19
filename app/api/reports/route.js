/**
 * GET /api/reports
 *
 * Returns the list of reports for the authenticated user.
 *
 * TODO (Module 2): Replace mock data with a real MongoDB query.
 *   1. Extract userId from the JWT in the Authorization header or session cookie.
 *   2. Connect to MongoDB (MONGODB_URI).
 *   3. Query: db.collection("reports").find({ userId }).sort({ createdAt: -1 }).toArray()
 *   4. Return the real documents.
 */

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all reports (or filter by userId if needed)
    const reports = await db
      .collection("reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const safeReports = reports.map(r => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(safeReports, { status: 200 });
  } catch (error) {
    console.error("[GET /api/reports]", error);
    return NextResponse.json(
      { error: "Failed to fetch reports", details: error.message },
      { status: 500 }
    );
  }
}
