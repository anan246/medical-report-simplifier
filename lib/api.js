/**
 * MediLens — API Client (Module 4)
 * Typed fetch wrapper for /api/reports and /api/compare
 *
 * Base URL: process.env.NEXT_PUBLIC_API_BASE_URL (falls back to same origin)
 * Auth: passes cookies automatically (credentials: "include")
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Fetch all reports for the authenticated user.
 * @returns {Promise<import("@/types/report").Report[]>}
 */
export async function getReports() {
  const res = await fetch(`${BASE}/api/reports`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GET /api/reports failed (${res.status}): ${err}`);
  }
  return res.json();
}

/**
 * Compare two reports by their IDs.
 * @param {string} idA
 * @param {string} idB
 * @returns {Promise<import("@/types/report").CompareResponse>}
 */
export async function compareReports(idA, idB) {
  const res = await fetch(
    `${BASE}/api/compare?a=${encodeURIComponent(idA)}&b=${encodeURIComponent(idB)}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GET /api/compare failed (${res.status}): ${err}`);
  }
  return res.json();
}
