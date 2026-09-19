/**
 * Proves that a signed-in account can only ever reach its own report data.
 *
 * Usage (app must be running, .env.local must have MONGODB_URI + JWT_SECRET):
 *   node scripts/verify-report-isolation.mjs
 *   BASE_URL=http://127.0.0.1:3001 node scripts/verify-report-isolation.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.BASE_URL || "http://127.0.0.1:3000";

const env = {};
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

let failures = 0;
function check(label, ok, detail) {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db();
const users = await db.collection("users").find({}).project({ userId: 1, email: 1, name: 1 }).toArray();
const reports = await db.collection("reports").find({}).project({ userId: 1, reportId: 1, fileUrl: 1 }).toArray();
await client.close();

const owner = users.find((u) => reports.some((r) => r.userId === u.userId));
if (!owner) {
  console.log("SKIP  no reports in the database — upload one, then re-run.");
  process.exit(0);
}
const owned = reports.filter((r) => r.userId === owner.userId);
const stranger = users.find((u) => u.userId !== owner.userId && !reports.some((r) => r.userId === u.userId))
  || { userId: randomUUID(), email: "isolation-probe@example.com", name: "Isolation probe" };

console.log(`owner  : ${owner.email} (${owned.length} reports)`);
console.log(`stranger: ${stranger.email}`);
console.log(`target : ${base}\n`);

const tokenFor = (u) => jwt.sign({ sub: u.userId, name: u.name, email: u.email }, env.JWT_SECRET, { expiresIn: "10m" });

async function request(pathname, user) {
  const res = await fetch(base + pathname, {
    headers: user ? { Cookie: "auth_token=" + tokenFor(user) } : {},
    cache: "no-store",
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, json, cacheControl: res.headers.get("cache-control"), vary: res.headers.get("vary") };
}

const anonymous = await request("/api/reports", null);
check("anonymous GET /api/reports is rejected", anonymous.status === 401, `status ${anonymous.status}`);

const asOwner = await request("/api/reports", owner);
check("owner sees own reports", asOwner.status === 200 && Array.isArray(asOwner.json) && asOwner.json.length === owned.length,
  `status ${asOwner.status}, ${Array.isArray(asOwner.json) ? asOwner.json.length : "?"} reports`);

const asStranger = await request("/api/reports", stranger);
check("stranger sees zero reports", asStranger.status === 200 && Array.isArray(asStranger.json) && asStranger.json.length === 0,
  `status ${asStranger.status}, ${Array.isArray(asStranger.json) ? asStranger.json.length : "?"} reports`);

const foreignReport = await request(`/api/reports/${owned[0].reportId}`, stranger);
check("stranger cannot open an owned report by id", foreignReport.status === 404, `status ${foreignReport.status}`);

const ownReport = await request(`/api/reports/${owned[0].reportId}`, owner);
check("owner can open their own report", ownReport.status === 200, `status ${ownReport.status}`);

if (owned.length >= 2) {
  const foreignCompare = await request(`/api/compare?a=${owned[0].reportId}&b=${owned[1].reportId}`, stranger);
  check("stranger cannot compare owned reports", foreignCompare.status === 404, `status ${foreignCompare.status}`);
}

const filename = String(owned[0].fileUrl || "").split("/").pop();
let ownFile = null;
if (filename) {
  const foreignFile = await request(`/api/reports/files/${filename}`, stranger);
  check("stranger cannot download an owned report file", foreignFile.status === 404, `status ${foreignFile.status}`);
  ownFile = await request(`/api/reports/files/${filename}`, owner);
  check("owner can download their own report file", ownFile.status === 200, `status ${ownFile.status}`);
}

const noStore = (res) => String(res.cacheControl || "").includes("no-store");
check("report list is sent with Cache-Control: no-store", noStore(asOwner), `cache-control: ${asOwner.cacheControl}`);
check("report list is sent with Vary: Cookie", String(asOwner.vary || "").toLowerCase().includes("cookie"), `vary: ${asOwner.vary}`);
check("report detail is sent with Cache-Control: no-store", noStore(ownReport), `cache-control: ${ownReport.cacheControl}`);
if (ownFile) {
  check("report file is sent with Cache-Control: no-store", noStore(ownFile), `cache-control: ${ownFile.cacheControl}`);
}

console.log(failures === 0 ? "\nAll isolation checks passed." : `\n${failures} isolation check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
