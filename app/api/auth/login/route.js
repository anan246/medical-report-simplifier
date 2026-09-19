import bcrypt from "bcryptjs";
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
		const { email, password } = await request.json();
		const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

		if (!normalizedEmail || typeof password !== "string" || !password) {
			return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
		}

		await connectDB();
		const user = await User.findOne({ email: normalizedEmail });
		const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatches) {
			return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
		}

		const response = NextResponse.json({
			user: { id: user.userId, name: user.name, email: user.email },
		});
		response.cookies.set("auth_token", createAuthToken(user), cookieOptions);
		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json({ error: "Unable to log in right now." }, { status: 500 });
	}
}
