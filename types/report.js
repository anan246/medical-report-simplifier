/**
 * MediLens — Shared Report Type Contract
 * Module 4: Report History + Compare + Download
 *
 * @typedef {Object} ReportTest
 * @property {string} [testId]
 * @property {string} testName
 * @property {number|string} value
 * @property {string} unit
 * @property {string} [referenceRange]
 * @property {string} [status]  — "normal" | "low" | "high" | "critical"
 */

/**
 * @typedef {Object} Report
 * @property {string} reportId
 * @property {string} userId
 * @property {string} reportName
 * @property {string} reportType
 * @property {string} reportDate
 * @property {{ gridFsFileId?: string, filename?: string, mimeType?: string, size?: number }} [originalFile]
 * @property {string} [rawText]
 * @property {ReportTest[]} tests
 * @property {string} [aiSummary]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} ComparisonRow
 * @property {string} testName
 * @property {number|string} valueA
 * @property {number|string} valueB
 * @property {string} unit
 * @property {number|null} delta        — numeric difference (B - A), null if non-numeric
 * @property {"increased"|"decreased"|"unchanged"} trend
 * @property {string} [statusA]
 * @property {string} [statusB]
 */

/**
 * @typedef {Object} CompareResponse
 * @property {Report} reportA
 * @property {Report} reportB
 * @property {ComparisonRow[]} comparison
 */
