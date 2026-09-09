import { asc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { events as eventsTable, siteCopy } from "@/db/schema";
import type { EventRow } from "@/db/schema";
import { toPastEvent, toUpcomingEvent } from "@/lib/cms/derive";
import {
  COPY_GROUP_KEYS,
  copySchemas,
  type CopyGroupKey,
  type AboutCopyValue,
  type CtaCopyValue,
  type DonateCopyValue,
  type SiteCopyValue,
  type UpcomingCopyValue,
  type WhatWeAreCopyValue,
  type WhoWeServeCopyValue,
} from "@/lib/cms/schemas";
import {
  aboutCopy,
  ctaCopy,
  donate,
  events as defaultEvents,
  site,
  upcomingCopy,
  upcomingEvents as defaultUpcomingEvents,
  whatWeAreCopy,
  whoWeServeCopy,
  type PastEvent,
  type UpcomingEvent,
} from "@/lib/content-defaults";

/** The seven editable copy groups, after validation. */
export type CopyValues = {
  site: SiteCopyValue;
  donate: DonateCopyValue;
  about: AboutCopyValue;
  whatWeAre: WhatWeAreCopyValue;
  whoWeServe: WhoWeServeCopyValue;
  cta: CtaCopyValue;
  upcomingCopy: UpcomingCopyValue;
};

/**
 * The baked-in copy that ships with the build. Every read falls back to this,
 * so a Neon outage or a bad row degrades to the previous wording instead of a
 * blank section. Parsing the defaults through the same schemas at module load
 * means a schema that drifts from the real content fails loudly in dev rather
 * than silently at runtime.
 */
export const copyDefaults: CopyValues = {
  site: copySchemas.site.parse(site),
  donate: copySchemas.donate.parse(donate),
  about: copySchemas.about.parse(aboutCopy),
  whatWeAre: copySchemas.whatWeAre.parse(whatWeAreCopy),
  whoWeServe: copySchemas.whoWeServe.parse(whoWeServeCopy),
  cta: copySchemas.cta.parse(ctaCopy),
  upcomingCopy: copySchemas.upcomingCopy.parse(upcomingCopy),
};

export type SiteContent = CopyValues & {
  pastEvents: PastEvent[];
  upcomingEvents: UpcomingEvent[];
  /** True when the page rendered from baked-in defaults, not the database. */
  usedFallback: boolean;
};

function defaultContent(): SiteContent {
  return {
    ...structuredClone(copyDefaults),
    pastEvents: [...defaultEvents],
    upcomingEvents: [...defaultUpcomingEvents],
    usedFallback: true,
  };
}

/** Parse one jsonb row, falling back to the default when it does not fit. */
function parseGroup<K extends CopyGroupKey>(key: K, value: unknown): CopyValues[K] {
  const parsed = copySchemas[key].safeParse(value);
  if (parsed.success) {
    return parsed.data as CopyValues[K];
  }
  console.error(`[cms] copy group "${key}" failed validation, using default`);
  return structuredClone(copyDefaults[key]);
}

/** Typed indexed write so the group union stays sound. */
function assignGroup<K extends CopyGroupKey>(
  target: CopyValues,
  key: K,
  value: unknown,
) {
  target[key] = parseGroup(key, value);
}

/**
 * Everything the marketing pages render. One round trip for copy, one for
 * events. Called per request (pages are force-dynamic) so a client save is
 * live on the very next page view.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isDatabaseConfigured()) {
    return defaultContent();
  }
  try {
    const db = getDb();
    const [copyRows, eventRows] = await Promise.all([
      db.select().from(siteCopy),
      db
        .select()
        .from(eventsTable)
        .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.createdAt)),
    ]);

    const byKey = new Map(copyRows.map((row) => [row.key, row.value]));
    const content = defaultContent();
    content.usedFallback = false;

    for (const key of COPY_GROUP_KEYS) {
      if (byKey.has(key)) {
        assignGroup(content, key, byKey.get(key));
      }
    }

    if (eventRows.length > 0) {
      content.pastEvents = eventRows
        .filter((row) => row.status === "past")
        .map(toPastEvent);
      content.upcomingEvents = eventRows
        .filter((row) => row.status === "upcoming")
        .map(toUpcomingEvent);
    }

    return content;
  } catch (error) {
    console.error("[cms] falling back to bundled content:", error);
    return defaultContent();
  }
}

/** Admin list view — raw rows, both statuses, in display order. */
export async function listEvents(): Promise<EventRow[]> {
  const db = getDb();
  return db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.createdAt));
}

export async function getEvent(id: string): Promise<EventRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

/** Admin copy editor — the stored value, or the default when unsaved. */
export async function getCopyGroup<K extends CopyGroupKey>(
  key: K,
): Promise<CopyValues[K]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(siteCopy)
      .where(eq(siteCopy.key, key))
      .limit(1);
    if (rows[0]) {
      return parseGroup(key, rows[0].value);
    }
  } catch (error) {
    console.error(`[cms] could not load copy group "${key}":`, error);
  }
  return structuredClone(copyDefaults[key]);
}
