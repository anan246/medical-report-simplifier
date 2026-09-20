/**
 * Removes the third-party sample reports that were uploaded while testing, so no other
 * patient's details are left visible in Report History / Report Compare.
 *
 * Dry run (default, changes nothing):
 *   node scripts/purge-sample-reports.mjs
 *
 * Delete the matched reports and their stored files:
 *   node scripts/purge-sample-reports.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");

const SAMPLE_PATTERNS = [
  /sterling-accuris/i,
  /omc report sample/i,
  /pediatric report/i,
  /sample_diabetes_lab_report/i,
  /^sample[-_ ]/i,
];

const env = {};
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db();
const users = await db.collection("users").find({}).project({ userId: 1, email: 1 }).toArray();
const emailById = new Map(users.map((u) => [u.userId, u.email]));

const all = await db.collection("reports").find({}).project({ userId: 1, reportId: 1, reportName: 1, fileUrl: 1 }).toArray();
const matches = all.filter((r) => SAMPLE_PATTERNS.some((p) => p.test(String(r.reportName || ""))));

console.log(`${all.length} report(s) in the database, ${matches.length} match the sample/third-party patterns.`);
console.log(apply ? "Mode: APPLY (rows and stored files will be deleted)\n" : "Mode: DRY RUN (nothing will be deleted)\n");

let rowsRemoved = 0;
let filesRemoved = 0;

for (const report of matches) {
  const owner = emailById.get(report.userId) || report.userId;
  console.log(`  - ${report.reportName}  [owner: ${owner}]`);
  if (!apply) continue;
  await db.collection("reports").deleteOne({ reportId: report.reportId });
  rowsRemoved += 1;
  const filename = String(report.fileUrl || "").split("/").pop();
  if (filename && /^[\w.-]+$/.test(filename) && report.fileUrl.startsWith("/api/reports/files/")) {
    const filePath = path.join(root, "storage", "uploads", filename);
    try {
      if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); filesRemoved += 1; }
    } catch (err) {
      console.log(`    ! could not delete ${filename}: ${err.message}`);
    }
  }
}

if (apply) {
  console.log(`\nDeleted ${rowsRemoved} report row(s) and ${filesRemoved} stored file(s).`);
} else {
  console.log("\nRe-run with --apply to delete these rows and files.");
}
await client.close();
