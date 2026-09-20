/**
 * GET /api/compare?a=<reportId>&b=<reportId>
 *
 * Aligns matching tests from two reports and computes trend + delta.
 * Returns: { reportA, reportB, comparison[] }
 *
 * TODO (Module 2): Replace MOCK_REPORTS lookup with real MongoDB queries.
 *   1. Fetch Report A and Report B by their IDs from MongoDB.
 *   2. Verify both belong to the authenticated user.
 *   3. Pass them into the compareReports() logic below.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { getAuthenticatedUser } from "@/lib/auth";
import { privateJson } from "@/lib/apiResponse";

/**
 * Align two report's test arrays and compute deltas + trends.
 * Purely objective — no medical diagnosis language.
 *
 * @param {import("@/types/report").Report} reportA
 * @param {import("@/types/report").Report} reportB
 * @returns {import("@/types/report").ComparisonRow[]}
 */
function buildComparison(reportA, reportB) {
  const mapB = new Map(reportB.tests.map((t) => [t.testName.toLowerCase(), t]));

  const rows = [];

  for (const testA of reportA.tests) {
    const key = testA.testName.toLowerCase();
    const testB = mapB.get(key);

    if (!testB) continue; // test only in report A — skip (not a matching pair)

    const numA = parseFloat(testA.value);
    const numB = parseFloat(testB.value);
    const isNumeric = !isNaN(numA) && !isNaN(numB);

    let delta = null;
    let trend = "unchanged";

    if (isNumeric) {
      delta = parseFloat((numB - numA).toFixed(4));
      if (Math.abs(delta) < 0.0001) {
        trend = "unchanged";
      } else if (delta > 0) {
        trend = "increased";
      } else {
        trend = "decreased";
      }
    } else {
      trend = testA.value === testB.value ? "unchanged" : "increased";
    }

    rows.push({
      testName: testA.testName,
      valueA: testA.value,
      valueB: testB.value,
      unit: testA.unit || testB.unit || "",
      referenceRange: testA.referenceRange || testB.referenceRange || null,
      delta,
      trend,
      statusA: testA.status ?? null,
      statusB: testB.status ?? null,
    });
  }

  return rows;
}

export async function GET(request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  if (!idA || !idB) {
    return NextResponse.json(
      { error: "Both ?a and ?b report IDs are required." },
      { status: 400 }
    );
  }

  if (idA === idB) {
    return NextResponse.json(
      { error: "Cannot compare a report with itself. Choose two different reports." },
      { status: 400 }
    );
  }

  try {
   await connectDB();

const findReport = async (id) => {
  return Report.findOne({ reportId: id, userId: user.userId })
    .select("reportId reportName reportType reportDate tests aiSummary createdAt updatedAt")
    .lean();
};

    const [reportA, reportB] = await Promise.all([
      findReport(idA),
      findReport(idB),
    ]);

    if (!reportA) {
      return NextResponse.json({ error: `Report not found: ${idA}` }, { status: 404 });
    }
    if (!reportB) {
      return NextResponse.json({ error: `Report not found: ${idB}` }, { status: 404 });
    }

    const comparison = buildComparison(reportA, reportB);

    return privateJson({
      reportA: { ...reportA, userId: undefined, fileUrl: undefined },
      reportB: { ...reportB, userId: undefined, fileUrl: undefined },
      comparison,
    }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/compare]", error);
    return NextResponse.json(
      { error: "Failed to compare reports", details: error.message },
      { status: 500 }
    );
  }
}
