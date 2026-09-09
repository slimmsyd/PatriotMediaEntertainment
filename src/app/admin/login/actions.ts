"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
  signSession,
} from "@/lib/auth/session";

export type LoginState = { error?: string };

/**
 * Throttles guessing without a dependency. One editor logging in a few times a
 * week does not need a shared store; a serverless instance recycling just
 * clears an in-memory counter, which is an acceptable trade here.
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; firstAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

/** Only same-origin relative paths, so `?next=` can't bounce off-site. */
function safeNext(value: FormDataEntryValue | null): string {
  const raw = typeof value === "string" ? value : "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/admin/events";
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (!isDatabaseConfigured()) {
    return {
      error: "The site is not connected to its database yet. Contact support.",
    };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  let user: { id: string; email: string; passwordHash: string } | undefined;
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        passwordHash: adminUsers.passwordHash,
      })
      .from(adminUsers)
      .where(sql`lower(${adminUsers.email}) = ${email}`)
      .limit(1);
    user = rows[0];
  } catch (error) {
    console.error("[admin] login lookup failed:", error);
    return { error: "Could not reach the database. Try again in a moment." };
  }

  // Same message and roughly the same work either way, so the form never
  // reveals whether an email exists.
  const ok = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, "$2a$12$invalidinvalidinvalidinvalidinva");

  if (!user || !ok) {
    return { error: "Invalid email or password." };
  }

  clearAttempts(ip);
  const token = await signSession({ userId: user.id, email: user.email });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));

  redirect(next);
}

export async function logout() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  redirect("/admin/login");
}
