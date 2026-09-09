/**
 * Seeds the Neon database from the copy and events baked into the build.
 *
 *   npm run db:seed
 *
 * Idempotent: copy groups and the admin user are upserted, events are matched
 * by slug. Re-run it with a new ADMIN_PASSWORD to reset the client's password.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Paste your Neon connection string into .env.local first.",
    );
  }

  // Imported after dotenv so the db client sees DATABASE_URL.
  const { getDb } = await import("../src/db/client");
  const { adminUsers, events, siteCopy } = await import("../src/db/schema");
  const { hashPassword } = await import("../src/lib/auth/password");
  const { copyDefaults } = await import("../src/lib/cms/queries");
  const defaults = await import("../src/lib/content-defaults");

  const db = getDb();

  // ── Copy groups ────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(copyDefaults)) {
    await db
      .insert(siteCopy)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteCopy.key,
        set: { value, updatedAt: new Date() },
      });
  }
  console.log(`✓ ${Object.keys(copyDefaults).length} copy groups upserted`);

  // ── Events ─────────────────────────────────────────────────────────────
  const publicDir = path.join(process.cwd(), "public");
  const assetExists = (assetPath?: string) =>
    !assetPath ||
    !assetPath.startsWith("/") ||
    existsSync(path.join(publicDir, assetPath));

  /** Splits "July 18, 2026 · Venue, City, ST" into an ISO date and a venue. */
  function splitMeta(meta?: string) {
    if (!meta) return { eventDate: null, venue: null, description: null };
    const [first, ...rest] = meta.split("·").map((part) => part.trim());
    const parsed = Date.parse(first);
    if (!Number.isNaN(parsed) && /\d{4}/.test(first)) {
      const d = new Date(parsed);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
      return {
        eventDate: iso,
        venue: rest.length > 0 ? rest.join(" · ") : null,
        description: null,
      };
    }
    return { eventDate: null, venue: null, description: meta };
  }

  type SeedRow = typeof events.$inferInsert;
  const rows: SeedRow[] = [];
  const skipped: string[] = [];
  let order = 0;

  for (const event of defaults.events) {
    const video = "video" in event ? event.video : undefined;
    const poster = "poster" in event ? event.poster : undefined;
    const image = "image" in event ? event.image : undefined;
    // The repo references four videos that were deleted from public/videos.
    // Seeding them would put broken tiles on the live rail.
    if (!assetExists(video) || !assetExists(poster) || !assetExists(image)) {
      skipped.push(event.id);
      continue;
    }
    order += 10;
    rows.push({
      slug: event.id,
      status: "past",
      title: event.title,
      eyebrow: event.eyebrow,
      ...splitMeta("meta" in event ? event.meta : undefined),
      imageUrl: image ?? null,
      imageAlt: "imageAlt" in event ? event.imageAlt : null,
      videoUrl: video ?? null,
      posterUrl: poster ?? null,
      sortOrder: order,
    });
  }

  for (const event of defaults.upcomingEvents) {
    if (!assetExists(event.image)) {
      skipped.push(event.id);
      continue;
    }
    const [day, month, year] = event.date.split(".");
    order += 10;
    rows.push({
      slug: event.id,
      status: "upcoming",
      title: event.title,
      eyebrow: "",
      eventDate: year && month && day ? `${year}-${month}-${day}` : null,
      imageUrl: event.image,
      imageAlt: event.imageAlt,
      href: event.href,
      sortOrder: order,
    });
  }

  for (const row of rows) {
    await db
      .insert(events)
      .values(row)
      .onConflictDoUpdate({
        target: events.slug,
        // Only backfill structure on re-seed; never clobber client edits to
        // title/copy that already live in the database.
        set: { updatedAt: new Date() },
      });
  }
  console.log(`✓ ${rows.length} events seeded`);
  if (skipped.length > 0) {
    console.log(
      `  skipped (asset missing from public/): ${skipped.join(", ")}`,
    );
  }

  // ── Admin user ─────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log(
      "! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user. Set them in .env.local and re-run to create the client's login.",
    );
  } else if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  } else {
    const passwordHash = await hashPassword(password);
    const existing = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(sql`lower(${adminUsers.email}) = ${email}`)
      .limit(1);
    if (existing[0]) {
      await db
        .update(adminUsers)
        .set({ passwordHash })
        .where(sql`id = ${existing[0].id}`);
      console.log(`✓ password reset for ${email}`);
    } else {
      await db.insert(adminUsers).values({ email, passwordHash });
      console.log(`✓ admin user created: ${email}`);
    }
  }

  console.log("\nSeed complete.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error);
  process.exit(1);
});
