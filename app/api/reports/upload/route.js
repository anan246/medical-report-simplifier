import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { validateFile, saveFile } from "@/lib/fileStorage";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type and size
    try {
      validateFile(file);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    // Save file to disk
    const { fileUrl } = await saveFile(file);

    // Create initial report record in MongoDB
    await connectDB();

    const reportId = uuidv4();
    const report = await Report.create({
      reportId,
      userId: user.userId,
      reportName: file.name,
      reportType: "pending",
      reportDate: new Date(),
      fileUrl,
      tests: [],
      aiSummary: "",
    });

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
      fileUrl,
      mimeType: file.type,
      message: "Report uploaded successfully",
    });
  } catch (err) {
    console.error("[/api/reports/upload]", err.message);
    return NextResponse.json(
      { success: false, message: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
