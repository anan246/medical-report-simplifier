import { NextResponse } from "next/server";

/**
 * Standard headers for responses that contain one patient's data.
 *
 * Without these, a response body can be stored by the browser (or an intermediate
 * cache) and replayed to a different signed-in patient on the same device, which
 * would disclose one patient's report data on another patient's screen.
 */
const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
  Vary: "Cookie, Authorization",
};

export function privateJson(data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...PRIVATE_HEADERS, ...(init.headers || {}) },
  });
}

export { PRIVATE_HEADERS };
