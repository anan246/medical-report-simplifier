/**
 * Normalizes a raw MongoDB report document into the UI-friendly shape
 * expected by the dashboard and test details page.
 *
 * Real DB schema (confirmed from Atlas inspection):
 * DB: "test", collection: "reports"
 * {
 *   _id: ObjectId,
 *   reportId: string (UUID),
 *   userId: string,
 *   reportName: string,
 *   reportType: string,
 *   reportDate: Date,
 *   tests: [{ testId, testName, value, unit, referenceRange, status }],
 *   aiSummary: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 *
 * status values from DB: "normal" | "above_range" | "below_range" | "unknown"
 * UI status values:      "Within Range" | "Outside Range" | ""
 */

/**
 * Maps Person 2's status strings to UI display values.
 */
function normalizeStatus(raw) {
  if (!raw) return "";
  const s = String(raw).toLowerCase().trim();
  if (s === "normal") return "Within Range";
  if (s === "above_range" || s === "below_range") return "Outside Range";
  // "unknown" or anything else — return empty so UI shows "—"
  return "";
}

/**
 * Normalizes a single test sub-document.
 * Uses testId (UUID) as the stable identifier.
 */
function normalizeTest(raw, index) {
  const testName = raw.testName ?? raw.name ?? `Test ${index + 1}`;
  // testId is a UUID assigned by Person 2's pipeline — use it directly
  const id = raw.testId ?? raw.id ?? `test-${index}`;

  return {
    id,
    testName,
    value: raw.value ?? "",
    unit: raw.unit ?? "",
    referenceRange: raw.referenceRange ?? raw.reference_range ?? "",
    status: normalizeStatus(raw.status),
  };
}

/**
 * Normalizes a full report document from MongoDB.
 * @param {object} doc - Raw MongoDB document (plain object, _id already stringified)
 */
export function normalizeReport(doc) {
  if (!doc) return null;

  // Use MongoDB _id (ObjectId string) as the canonical report identifier
  // reportId (UUID) is also preserved for reference
  const id = doc._id?.toString() ?? "";

  const reportName = doc.reportName ?? doc.name ?? "Medical Report";

  // reportDate is the field Person 2 uses (not "date")
  const rawDate = doc.reportDate ?? doc.date ?? null;
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const tests = Array.isArray(doc.tests) ? doc.tests.map(normalizeTest) : [];

  return { id, reportName, reportType: doc.reportType ?? "", date, tests };
}

/**
 * Normalizes a report document for the report list (no tests — lighter payload).
 */
export function normalizeReportSummary(doc) {
  if (!doc) return null;
  const id = doc._id?.toString() ?? "";
  const reportName = doc.reportName ?? doc.name ?? "Medical Report";
  const rawDate = doc.reportDate ?? doc.date ?? null;
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const testCount = Array.isArray(doc.tests) ? doc.tests.length : 0;
  return {
    id,
    reportId: doc.reportId ?? id,
    reportName,
    reportType: doc.reportType ?? "",
    reportDate: rawDate,
    date,
    tests: Array.isArray(doc.tests) ? doc.tests.map(normalizeTest) : [],
    testCount,
  };
}
