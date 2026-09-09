import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  verifySession,
  type SessionPayload,
} from "@/lib/auth/session";

/** Current admin session, or null. Safe to call from any server component. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Guard for admin pages and every admin server action. proxy.ts does the same
 * check first, but that one is optimistic — this is the real gate, so a server
 * action can never be invoked without a live session.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
