import { describe, expect, it } from "vitest";
import {
  COPY_GROUP_KEYS,
  copySchemas,
  eventInputSchema,
  fieldErrors,
  isCopyGroupKey,
} from "@/lib/cms/schemas";
import {
  aboutCopy,
  ctaCopy,
  donate,
  site,
  upcomingCopy,
  whatWeAreCopy,
  whoWeServeCopy,
} from "@/lib/content-defaults";

const defaults = {
  site,
  donate,
  about: aboutCopy,
  whatWeAre: whatWeAreCopy,
  whoWeServe: whoWeServeCopy,
  cta: ctaCopy,
  upcomingCopy,
};

describe("copy schemas", () => {
  it("accepts every shipped default, so the fallback can never be invalid", () => {
    for (const key of COPY_GROUP_KEYS) {
      const result = copySchemas[key].safeParse(defaults[key]);
      expect(result.success, `${key} failed: ${result.error?.message}`).toBe(
        true,
      );
    }
  });

  it("rejects a blank required field", () => {
    const result = copySchemas.whoWeServe.safeParse({
      ...whoWeServeCopy,
      title: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty repeatable list", () => {
    expect(
      copySchemas.about.safeParse({ ...aboutCopy, detail: [] }).success,
    ).toBe(false);
  });

  it("recognises only real group keys", () => {
    expect(isCopyGroupKey("about")).toBe(true);
    expect(isCopyGroupKey("constructor")).toBe(false);
    expect(isCopyGroupKey("nope")).toBe(false);
  });
});

describe("eventInputSchema", () => {
  const valid = {
    title: "Benefit Concert",
    eyebrow: "Benefit",
    status: "past" as const,
    eventDate: "2026-07-18",
    venue: "Manassas, VA",
    description: "",
    imageUrl: "https://blob.example/flyer.jpg",
    imageAlt: "Concert flyer",
    videoUrl: "",
    posterUrl: "",
    href: "",
  };

  it("accepts a complete past event", () => {
    expect(eventInputSchema.safeParse(valid).success).toBe(true);
  });

  it("requires some media", () => {
    const result = eventInputSchema.safeParse({ ...valid, imageUrl: "" });
    expect(result.success).toBe(false);
    expect(fieldErrors(result.error!).imageUrl).toMatch(/photo/i);
  });

  it("requires alt text whenever there is a photo", () => {
    const result = eventInputSchema.safeParse({ ...valid, imageAlt: "" });
    expect(fieldErrors(result.error!).imageAlt).toMatch(/screen readers/i);
  });

  it("requires a date on upcoming events only", () => {
    expect(
      eventInputSchema.safeParse({ ...valid, eventDate: "" }).success,
    ).toBe(true);
    const upcoming = eventInputSchema.safeParse({
      ...valid,
      status: "upcoming",
      eventDate: "",
    });
    expect(fieldErrors(upcoming.error!).eventDate).toMatch(/need a date/i);
  });

  it("rejects a non-ISO date", () => {
    const result = eventInputSchema.safeParse({
      ...valid,
      eventDate: "18/07/2026",
    });
    expect(result.success).toBe(false);
  });

  it("allows a video-only event with no photo", () => {
    expect(
      eventInputSchema.safeParse({
        ...valid,
        imageUrl: "",
        imageAlt: "",
        videoUrl: "/videos/event-1.mp4",
        posterUrl: "/images/event-1.jpg",
      }).success,
    ).toBe(true);
  });
});
