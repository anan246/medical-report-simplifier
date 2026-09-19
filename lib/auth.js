import jwt from "jsonwebtoken";

export function createAuthToken(user) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Please define JWT_SECRET in .env.local");
  }

  return jwt.sign(
    { sub: user.userId, name: user.name, email: user.email },
    jwtSecret,
    { expiresIn: "7d" }
  );
}