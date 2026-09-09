import { describe, expect, it } from "vitest";
import {
  buildMeta,
  deriveKind,
  formatEventDate,
  formatUpcomingDate,
  slugify,
  toPastEvent,
  toUpcomingEvent,
} from "@/lib/cms/derive";
import type { EventRow } from "@/db/schema";

function row(overrides: Partial<EventRow> = {}): EventRow {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    slug: "test-event",
    status: "past",
    title: "Test Event",
    eyebrow: "Benefit",
    eventDate: null,
    venue: null,
    description: null,
    imageUrl: null,
    imageAlt: null,
    videoUrl: null,
    posterUrl: null,
    href: null,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("deriveKind", () => {
  it("is a flyer when only a photo is set", () => {
    expect(deriveKind(row({ imageUrl: "/a.jpg" }))).toBe("flyer");
  });

  it("is a film when a video and poster are set", () => {
    expect(
      deriveKind(row({ videoUrl: "/v.mp4", posterUrl: "/p.jpg" })),
    ).toBe("film");
  });

  it("is a duo when video, poster and photo are all set", () => {
    expect(
      deriveKind(
        row({ videoUrl: "/v.mp4", posterUrl: "/p.jpg", imageUrl: "/a.jpg" }),
      ),
    ).toBe("duo");
  });

  it("falls back to flyer when a video has no poster", () => {
    expect(deriveKind(row({ videoUrl: "/v.mp4", imageUrl: "/a.jpg" }))).toBe(
      "flyer",
    );
  });
});

describe("formatEventDate", () => {
  it("formats an ISO date as the rail displays it", () => {
    expect(formatEventDate("2026-07-18")).toBe("July 18, 2026");
  });

  it("does not shift the day across timezones", () => {
    expect(formatEventDate("2026-01-01")).toBe("January 1, 2026");
    expect(formatEventDate("2026-12-31")).toBe("December 31, 2026");
  });

  it("returns an empty string for missing or malformed input", () => {
    expect(formatEventDate(null)).toBe("");
    expect(formatEventDate("July 2026")).toBe("");
    expect(formatEventDate("2026-13-01")).toBe("");
  });
});

describe("formatUpcomingDate", () => {
  it("formats as DD.MM.YYYY", () => {
    expect(formatUpcomingDate("2026-10-03")).toBe("03.10.2026");
  });

  it("returns an empty string when unset", () => {
    expect(formatUpcomingDate(null)).toBe("");
  });
});

describe("buildMeta", () => {
  it("joins date, venue and description with a middot", () => {
    expect(
      buildMeta({
        eventDate: "2026-07-18",
        venue: "Kingdom Ambassadors Center, Manassas, VA",
        description: null,
      }),
    ).toBe("July 18, 2026 · Kingdom Ambassadors Center, Manassas, VA");
  });

  it("skips empty parts instead of leaving stray separators", () => {
    expect(
      buildMeta({ eventDate: null, venue: "  ", description: "Sold out" }),
    ).toBe("Sold out");
    expect(
      buildMeta({ eventDate: null, venue: null, description: null }),
    ).toBe("");
  });
});

describe("toPastEvent", () => {
  it("maps a flyer row to the flyer tile shape", () => {
    const event = toPastEvent(
      row({
        slug: "prayer-vigil",
        imageUrl: "/images/vigil.jpg",
        imageAlt: "Candlelight vigil",
        eventDate: "2026-07-18",
        venue: "Manassas, VA",
      }),
    );
    expect(event).toEqual({
      kind: "flyer",
      id: "prayer-vigil",
      title: "Test Event",
      eyebrow: "Benefit",
      meta: "July 18, 2026 · Manassas, VA",
      image: "/images/vigil.jpg",
      imageAlt: "Candlelight vigil",
    });
  });

  it("maps a film row without a meta line", () => {
    const event = toPastEvent(
      row({ videoUrl: "/videos/e1.mp4", posterUrl: "/images/e1.jpg" }),
    );
    expect(event.kind).toBe("film");
    expect(event).not.toHaveProperty("meta");
  });
});

describe("toUpcomingEvent", () => {
  it("defaults a blank link to the contact page", () => {
    expect(toUpcomingEvent(row({ href: "" })).href).toBe("/contact");
    expect(toUpcomingEvent(row({ href: "/tickets" })).href).toBe("/tickets");
  });
});

describe("slugify", () => {
  it("makes a url-safe slug", () => {
    expect(slugify("Prayer & Candlelight Vigil")).toBe(
      "prayer-candlelight-vigil",
    );
  });

  it("never returns an empty slug", () => {
    expect(slugify("!!!")).toBe("event");
  });
});
