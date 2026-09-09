import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

/**
 * Neon over HTTP — one round trip per query, no connection pool to manage,
 * which is what serverless (Vercel) wants. The client is created lazily so a
 * missing DATABASE_URL surfaces as a caught query error and the site falls back
 * to baked-in defaults, rather than blowing up at import time.
 */
let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!cached) {
    cached = drizzle(neon(url), { schema });
  }
  return cached;
}
