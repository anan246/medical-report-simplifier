import connectDB from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import { privateJson } from "@/lib/apiResponse";

export async function GET(request) {
  if (!getAuthenticatedUser(request)) {
    return Response.json({ success: false, message: "Authentication required." }, { status: 401 });
  }
  try {
    await connectDB();

    return privateJson({
      success: true,
      message: "MongoDB connected successfully!",
    });
  } catch (error) {
    console.error("MONGODB ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}