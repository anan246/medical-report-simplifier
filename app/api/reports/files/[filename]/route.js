import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { getAuthenticatedUser } from "@/lib/auth";

const CONTENT_TYPES = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

export async function GET(request, { params }) {
  const user = getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { filename } = await params;
  if (!filename || filename !== path.basename(filename) || !/^[\w.-]+$/.test(filename)) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }

  try {
    await connectDB();
    const report = await Report.findOne({ userId: user.userId, fileUrl: { $regex: `${filename}$` } }).select("fileUrl").lean();
    if (!report) return NextResponse.json({ error: "File not found." }, { status: 404 });

    const root = report.fileUrl.startsWith("/api/reports/files/")
      ? path.join(process.cwd(), "storage", "uploads")
      : path.join(process.cwd(), "public", "uploads");
    const file = await readFile(path.join(root, filename));
    const extension = path.extname(filename).slice(1).toLowerCase();
    return new Response(file, {
      headers: {
        "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        Vary: "Cookie, Authorization",
      },
    });
  } catch (error) {
    console.error("[GET /api/reports/files/:filename]", error.message);
    return NextResponse.json({ error: "Unable to load file." }, { status: 404 });
  }
}