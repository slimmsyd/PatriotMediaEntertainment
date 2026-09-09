import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "pme_admin";
const SESSION_DAYS = 7;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short — generate one with `openssl rand -base64 32`",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = { userId: string; email: string };

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

/** Returns null for anything not a live, correctly signed session. */
export async function verifySession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Cookie options shared by login (set) and logout (clear). */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
