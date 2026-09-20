import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createAuthToken } from "@/lib/auth";

const cookieOptions = {
	httpOnly: true,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7,
	path: "/",
};

export async function POST(request) {
	try {
		const { name, email, password } = await request.json();
		const normalizedName = typeof name === "string" ? name.trim() : "";
		const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

		if (!normalizedName || !normalizedEmail || typeof password !== "string") {
			return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
		}

		if (normalizedName.length < 2 || normalizedName.length > 80) {
			return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
		}

		if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
			return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
		}

		if (password.length < 8) {
			return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
		}

		await connectDB();

		if (await User.exists({ email: normalizedEmail })) {
			return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
		}

		const passwordHash = await bcrypt.hash(password, 12);
		const user = await User.create({
			userId: randomUUID(),
			name: normalizedName,
			email: normalizedEmail,
			passwordHash,
		});

		const response = NextResponse.json({
			user: { id: user.userId, name: user.name, email: user.email },
		}, { status: 201 });
		response.cookies.set("auth_token", createAuthToken(user), cookieOptions);
		return response;
	} catch (error) {
		if (error?.code === 11000) {
			return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
		}

		console.error("Signup error:", error);
		return NextResponse.json({ error: "Unable to create your account right now." }, { status: 500 });
	}
}
