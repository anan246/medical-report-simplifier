import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

const LANGUAGES = ["en", "hi", "kn"];
const THEMES = ["light", "dark", "system"];

function serializeUser(user) {
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || "",
    createdAt: user.createdAt,
    language: user.language || "en",
    theme: user.theme || "system",
    notifications: {
      email: user.notifications?.email ?? true,
      reportReady: user.notifications?.reportReady ?? true,
      productUpdates: user.notifications?.productUpdates ?? false,
    },
    voice: {
      enabled: user.voice?.enabled ?? true,
      autoReadSummary: user.voice?.autoReadSummary ?? false,
      language: user.voice?.language || user.language || "en",
      rate: user.voice?.rate ?? 1,
    },
  };
}

function validationError(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request) {
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ userId: authUser.userId }).select("-passwordHash").lean();
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    console.error("[GET /api/settings]", error.message);
    return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PUT(request) {
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid request body.");
  }

  const update = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 80) {
      return validationError("Name must be between 2 and 80 characters.");
    }
    update.name = body.name.trim();
  }
  if (body.language !== undefined) {
    if (!LANGUAGES.includes(body.language)) return validationError("Unsupported language.");
    update.language = body.language;
  }
  if (body.theme !== undefined) {
    if (!THEMES.includes(body.theme)) return validationError("Unsupported theme.");
    update.theme = body.theme;
  }
  if (body.profileImage !== undefined) {
    if (typeof body.profileImage !== "string" || body.profileImage.length > 2_000_000) {
      return validationError("Profile image is too large.");
    }
    if (body.profileImage && !/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(body.profileImage)) {
      return validationError("Profile image must be a PNG, JPG, or WebP image.");
    }
    update.profileImage = body.profileImage;
  }
  if (body.notifications !== undefined) {
    if (!body.notifications || typeof body.notifications !== "object") return validationError("Invalid notification settings.");
    for (const key of ["email", "reportReady", "productUpdates"]) {
      if (body.notifications[key] !== undefined && typeof body.notifications[key] !== "boolean") {
        return validationError("Notification settings must be boolean values.");
      }
      if (body.notifications[key] !== undefined) update[`notifications.${key}`] = body.notifications[key];
    }
  }
  if (body.voice !== undefined) {
    if (!body.voice || typeof body.voice !== "object") return validationError("Invalid voice settings.");
    if (body.voice.enabled !== undefined && typeof body.voice.enabled !== "boolean") return validationError("Voice enabled must be boolean.");
    if (body.voice.autoReadSummary !== undefined && typeof body.voice.autoReadSummary !== "boolean") return validationError("Auto-read must be boolean.");
    if (body.voice.language !== undefined && !LANGUAGES.includes(body.voice.language)) return validationError("Unsupported voice language.");
    if (body.voice.rate !== undefined && (typeof body.voice.rate !== "number" || body.voice.rate < 0.5 || body.voice.rate > 2)) return validationError("Speech speed must be between 0.5 and 2.");
    for (const key of ["enabled", "autoReadSummary", "language", "rate"]) {
      if (body.voice[key] !== undefined) update[`voice.${key}`] = body.voice[key];
    }
  }

  if (update.language && body.voice?.language === undefined) update["voice.language"] = update.language;

  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { userId: authUser.userId },
      { $set: { ...update, updatedAt: new Date() } },
      { new: true, runValidators: true }
    ).select("-passwordHash").lean();
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    console.error("[PUT /api/settings]", error.message);
    return NextResponse.json({ error: "Unable to save settings." }, { status: 500 });
  }
}