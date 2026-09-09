import { and, asc, eq, ne, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { events as eventsTable, siteCopy } from "@/db/schema";
import type { EventRow } from "@/db/schema";
import { slugify } from "@/lib/cms/derive";
import type { CopyGroupKey } from "@/lib/cms/schemas";
import type { EventInput } from "@/lib/cms/schemas";

export async function upsertCopy(key: CopyGroupKey, value: unknown) {
  const db = getDb();
  await db
    .insert(siteCopy)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteCopy.key,
      set: { value, updatedAt: new Date() },
    });
}

/** Turns "" into null so empty optional columns stay NULL, not empty strings. */
function nullify(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Appends "-2", "-3"… until the slug is free. Excludes the row being edited. */
async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const db = getDb();
  const base = slugify(title);
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const clash = await db
      .select({ id: eventsTable.id })
      .from(eventsTable)
      .where(
        excludeId
          ? and(eq(eventsTable.slug, candidate), ne(eventsTable.id, excludeId))
          : eq(eventsTable.slug, candidate),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
  }
  return `${base}-${Date.now()}`;
}

function toColumns(input: EventInput) {
  return {
    status: input.status,
    title: input.title.trim(),
    eyebrow: input.eyebrow.trim(),
    eventDate: nullify(input.eventDate),
    venue: nullify(input.venue),
    description: nullify(input.description),
    imageUrl: nullify(input.imageUrl),
    imageAlt: nullify(input.imageAlt),
    videoUrl: nullify(input.videoUrl),
    posterUrl: nullify(input.posterUrl),
    href: nullify(input.href),
  };
}

export async function createEvent(input: EventInput): Promise<EventRow> {
  const db = getDb();
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${eventsTable.sortOrder}), 0)` })
    .from(eventsTable);
  const [row] = await db
    .insert(eventsTable)
    .values({
      ...toColumns(input),
      slug: await uniqueSlug(input.title),
      sortOrder: Number(max) + 10,
    })
    .returning();
  return row;
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<EventRow | null> {
  const db = getDb();
  const [row] = await db
    .update(eventsTable)
    .set({
      ...toColumns(input),
      slug: await uniqueSlug(input.title, id),
      updatedAt: new Date(),
    })
    .where(eq(eventsTable.id, id))
    .returning();
  return row ?? null;
}

export async function deleteEvent(id: string) {
  const db = getDb();
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
}

/**
 * Swaps sort order with the neighbour above or below inside the same status
 * list, so reordering the past rail never disturbs upcoming events.
 */
export async function moveEvent(id: string, direction: "up" | "down") {
  const db = getDb();
  const [current] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);
  if (!current) return;

  const siblings = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.status, current.status))
    .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.createdAt));

  const index = siblings.findIndex((row) => row.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const target = siblings[targetIndex];
  if (index < 0 || !target) return;

  // Sort orders can be equal after a seed, so rewrite the whole list rather
  // than swapping two values that might collide.
  const reordered = [...siblings];
  reordered[index] = target;
  reordered[targetIndex] = current;

  await Promise.all(
    reordered.map((row, position) =>
      db
        .update(eventsTable)
        .set({ sortOrder: (position + 1) * 10, updatedAt: new Date() })
        .where(eq(eventsTable.id, row.id)),
    ),
  );
}
