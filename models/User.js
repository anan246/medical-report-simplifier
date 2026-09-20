import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      enum: ["en", "hi", "kn"],
      default: "en",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    notifications: {
      email: { type: Boolean, default: true },
      reportReady: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: false },
    },

    voice: {
      enabled: { type: Boolean, default: true },
      autoReadSummary: { type: Boolean, default: false },
      language: { type: String, enum: ["en", "hi", "kn"], default: "en" },
      rate: { type: Number, min: 0.5, max: 2, default: 1 },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
  }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;