import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * The single client login. One row. Reset the password by re-running the seed
 * script with a new ADMIN_PASSWORD — there is no self-serve reset flow.
 */
export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("admin_users_email_key").on(sql`lower(${t.email})`)],
);

/**
 * Editable copy, one row per group (about, whatWeAre, ...). The shape of
 * `value` is validated by the matching zod schema in lib/cms/schemas.ts on both
 * write and read, so a hand-edited bad row falls back to the baked-in default
 * instead of crashing the page.
 */
export const siteCopy = pgTable("site_copy", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Past and upcoming events in one table. The rail tile style (film / flyer /
 * duo) is derived from which media columns are filled — see lib/cms/derive.ts —
 * rather than stored, so the client never has to pick a "kind".
 */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    /** "past" (events rail) or "upcoming" (upcoming section). */
    status: text("status").notNull().default("past"),
    title: text("title").notNull(),
    eyebrow: text("eyebrow").notNull().default(""),
    eventDate: date("event_date"),
    venue: text("venue"),
    description: text("description"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    /** Seeded from /public/videos. Not uploadable from the admin panel yet. */
    videoUrl: text("video_url"),
    posterUrl: text("poster_url"),
    /** CTA target for upcoming events. */
    href: text("href"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("events_slug_key").on(t.slug),
    index("events_status_sort_idx").on(t.status, t.sortOrder),
  ],
);

export type AdminUserRow = typeof adminUsers.$inferSelect;
export type SiteCopyRow = typeof siteCopy.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;
