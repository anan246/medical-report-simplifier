import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
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