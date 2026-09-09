import type { PastEvent, UpcomingEvent } from "@/lib/content-defaults";
import type { EventRow } from "@/db/schema";

/**
 * The events rail renders three tile shapes. The client never picks one — it
 * falls out of which media a row has, so uploading a flyer photo gives a flyer
 * tile and a seeded video + poster gives a film tile.
 */
export function deriveKind(row: {
  imageUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
}): PastEvent["kind"] {
  const hasVideo = Boolean(row.videoUrl && row.posterUrl);
  const hasImage = Boolean(row.imageUrl);
  if (hasVideo && hasImage) return "duo";
  if (hasVideo) return "film";
  return "flyer";
}

/** "2026-07-18" → "July 18, 2026". Parsed as calendar parts, never as UTC. */
export function formatEventDate(iso: string | null): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const name = monthNames[Number(month) - 1];
  if (!name) return "";
  return `${name} ${Number(day)}, ${year}`;
}

/** "2026-10-03" → "03.10.2026", the display format the upcoming rail uses. */
export function formatUpcomingDate(iso: string | null): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/** Date + venue + description joined with the middot the design uses. */
export function buildMeta(row: {
  eventDate: string | null;
  venue: string | null;
  description: string | null;
}): string {
  return [formatEventDate(row.eventDate), row.venue, row.description]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" · ");
}

/** DB row → the exact PastEvent union the events rail already renders. */
export function toPastEvent(row: EventRow): PastEvent {
  const kind = deriveKind(row);
  const base = {
    id: row.slug,
    title: row.title,
    eyebrow: row.eyebrow,
  };
  if (kind === "film") {
    return {
      ...base,
      kind: "film",
      video: row.videoUrl ?? "",
      poster: row.posterUrl ?? "",
    };
  }
  if (kind === "duo") {
    return {
      ...base,
      kind: "duo",
      meta: buildMeta(row),
      video: row.videoUrl ?? "",
      poster: row.posterUrl ?? "",
      image: row.imageUrl ?? "",
      imageAlt: row.imageAlt ?? "",
    };
  }
  return {
    ...base,
    kind: "flyer",
    meta: buildMeta(row),
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? "",
  };
}

/** DB row → the UpcomingEvent shape the upcoming rail already renders. */
export function toUpcomingEvent(row: EventRow): UpcomingEvent {
  return {
    id: row.slug,
    date: formatUpcomingDate(row.eventDate),
    title: row.title,
    href: row.href && row.href.length > 0 ? row.href : "/contact",
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? "",
  };
}

/** Title → url-safe slug. Collisions are resolved by the caller. */
export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base.length > 0 ? base : "event";
}
