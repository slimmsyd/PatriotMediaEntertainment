import { z } from "zod";

/**
 * Shapes for every editable copy group. These are the contract between the
 * admin forms, the jsonb column, and the section components — the same schema
 * validates a save and parses a row on read, so a malformed row can never reach
 * a component.
 */

const line = z.string().trim().min(1, "Required");
const optionalLine = z.string().trim().default("");
const paragraph = z.string().trim().min(1, "Required");
/** Internal path or full URL. Kept loose so "/contact" and "#upcoming" pass. */
const link = z.string().trim().min(1, "Required");

export const siteSchema = z.object({
  name: line,
  wordmark: line,
  phone: line,
  addressLines: z.array(line).min(1, "Add at least one address line"),
  bookingsHours: line,
});

export const donateSchema = z.object({
  label: line,
  ariaLabel: line,
  blurb: paragraph,
  itemName: line,
});

export const aboutSchema = z.object({
  eyebrow: line,
  title: line,
  lead: paragraph,
  detail: z.array(paragraph).min(1, "Add at least one paragraph"),
  cta: line,
  ctaHref: link,
  founderImage: link,
  founderImageAlt: line,
  founderName: line,
  founderRole: line,
});

export const whatWeAreSchema = z.object({
  headline: line,
  body: paragraph,
  marketMarkers: z
    .array(
      z.object({
        label: line,
        emphasis: z.boolean().optional(),
      }),
    )
    .min(1, "Add at least one market"),
});

export const whoWeServeSchema = z.object({
  eyebrow: line,
  title: line,
  body: paragraph,
  cta: line,
  ctaHref: link,
});

export const ctaSchema = z.object({
  titleLines: z.array(line).min(1, "Add at least one line"),
  button: line,
});

export const upcomingCopySchema = z.object({
  eyebrow: line,
  title: line,
  seeAll: line,
  seeAllHref: link,
});

export const copySchemas = {
  site: siteSchema,
  donate: donateSchema,
  about: aboutSchema,
  whatWeAre: whatWeAreSchema,
  whoWeServe: whoWeServeSchema,
  cta: ctaSchema,
  upcomingCopy: upcomingCopySchema,
} as const;

export type CopyGroupKey = keyof typeof copySchemas;

export const COPY_GROUP_KEYS = Object.keys(copySchemas) as CopyGroupKey[];

export function isCopyGroupKey(value: string): value is CopyGroupKey {
  return Object.prototype.hasOwnProperty.call(copySchemas, value);
}

/** Human labels + blurbs for the admin copy index. */
export const COPY_GROUP_LABELS: Record<
  CopyGroupKey,
  { title: string; blurb: string }
> = {
  site: {
    title: "Contact details",
    blurb: "Company name, phone number, office address and bookings hours.",
  },
  about: {
    title: "Who we are",
    blurb: "Founder story, portrait caption and the button under it.",
  },
  whatWeAre: {
    title: "About panel",
    blurb: "The dark statement panel headline, body and the regions listed.",
  },
  whoWeServe: {
    title: "Who we serve",
    blurb: "Audience heading, body copy and the booking button.",
  },
  cta: {
    title: "Contact card",
    blurb: "The two-line heading above the military seals and its button.",
  },
  upcomingCopy: {
    title: "Upcoming events heading",
    blurb: "Eyebrow, heading and the 'see all' link above the footer.",
  },
  donate: {
    title: "Donate button",
    blurb: "Donate label, screen-reader text and the supporting sentence.",
  },
};

export type SiteCopyValue = z.infer<typeof siteSchema>;
export type DonateCopyValue = z.infer<typeof donateSchema>;
export type AboutCopyValue = z.infer<typeof aboutSchema>;
export type WhatWeAreCopyValue = z.infer<typeof whatWeAreSchema>;
export type WhoWeServeCopyValue = z.infer<typeof whoWeServeSchema>;
export type CtaCopyValue = z.infer<typeof ctaSchema>;
export type UpcomingCopyValue = z.infer<typeof upcomingCopySchema>;

/** Event form input. Media URLs arrive already uploaded to Vercel Blob. */
export const eventInputSchema = z
  .object({
    title: line,
    eyebrow: optionalLine,
    status: z.enum(["past", "upcoming"]),
    /** ISO yyyy-mm-dd, or "" when the client leaves it blank. */
    eventDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker")
      .or(z.literal(""))
      .default(""),
    venue: optionalLine,
    description: optionalLine,
    imageUrl: optionalLine,
    imageAlt: optionalLine,
    videoUrl: optionalLine,
    posterUrl: optionalLine,
    href: optionalLine,
  })
  .superRefine((value, ctx) => {
    const hasImage = value.imageUrl.length > 0;
    const hasVideo = value.videoUrl.length > 0;
    if (!hasImage && !hasVideo) {
      ctx.addIssue({
        code: "custom",
        path: ["imageUrl"],
        message: "Add a photo for this event",
      });
    }
    if (hasImage && value.imageAlt.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["imageAlt"],
        message: "Describe the photo so screen readers can read it out",
      });
    }
    if (value.status === "upcoming" && value.eventDate.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Upcoming events need a date",
      });
    }
  });

export type EventInput = z.infer<typeof eventInputSchema>;

/**
 * Zod issues flattened to `{ "path.to.field": "message" }` for form rendering.
 * Written by hand rather than using flatten()/treeifyError() so nested array
 * paths like `detail.1` stay addressable by the form inputs.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!(key in out)) {
      out[key] = issue.message;
    }
  }
  return out;
}
