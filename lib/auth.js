import jwt from "jsonwebtoken";

export function getAuthToken(request) {
  return request?.cookies?.get("auth_token")?.value || null;
}

export function verifyAuthToken(token) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Please define JWT_SECRET in .env.local");
  }

  if (!token) return null;

  try {
    const payload = jwt.verify(token, jwtSecret);
    return typeof payload === "object" && typeof payload.sub === "string" ? payload : null;
  } catch {
    return null;
  }
}

export function getAuthenticatedUser(request) {
  const payload = verifyAuthToken(getAuthToken(request));
  return payload ? { userId: payload.sub, email: payload.email || "", name: payload.name || "" } : null;
}

export function requireAuthenticatedUser(request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    const error = new Error("Authentication required.");
    error.status = 401;
    throw error;
  }
  return user;
}

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