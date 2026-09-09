"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveEvent } from "@/app/admin/actions";
import { emptyFormState, type FormState } from "@/lib/cms/form-state";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Banner,
  Field,
  PrimaryButton,
  inputClass,
} from "@/components/admin/ui";
import type { EventRow } from "@/db/schema";

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending}>
      {pending ? "Saving…" : isNew ? "Add event" : "Save changes"}
    </PrimaryButton>
  );
}

export function EventForm({ event }: { event?: EventRow }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    saveEvent,
    emptyFormState,
  );
  const errors = state.errors ?? {};
  const isNew = !event;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <Banner tone="error">{state.message}</Banner>
      )}
      {event && <input type="hidden" name="id" value={event.id} />}
      {/* Videos are seeded from the repo and stay put; the form carries them
          through so saving a film tile does not wipe its footage. */}
      <input type="hidden" name="videoUrl" value={event?.videoUrl ?? ""} />
      <input type="hidden" name="posterUrl" value={event?.posterUrl ?? ""} />

      <Field label="Event name" error={errors.title}>
        <input
          className={inputClass}
          name="title"
          defaultValue={event?.title ?? ""}
          required
          autoFocus={isNew}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Shows in"
          hint="Upcoming events appear near the footer. Past events fill the scrolling rail."
          error={errors.status}
        >
          <select
            className={inputClass}
            name="status"
            defaultValue={event?.status ?? "upcoming"}
          >
            <option value="upcoming">Upcoming events</option>
            <option value="past">Past events</option>
          </select>
        </Field>

        <Field
          label="Date"
          hint="Leave blank on a past event if you would rather not show one."
          error={errors.eventDate}
        >
          <input
            className={inputClass}
            type="date"
            name="eventDate"
            defaultValue={event?.eventDate ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Category"
          hint="The small label above the name, e.g. Benefit."
          error={errors.eyebrow}
        >
          <input
            className={inputClass}
            name="eyebrow"
            defaultValue={event?.eyebrow ?? ""}
          />
        </Field>

        <Field label="Venue" hint="e.g. Bearded Monkey, Fredericksburg, VA" error={errors.venue}>
          <input
            className={inputClass}
            name="venue"
            defaultValue={event?.venue ?? ""}
          />
        </Field>
      </div>

      <Field
        label="Extra detail"
        hint="Optional. Shown after the date and venue."
        error={errors.description}
      >
        <input
          className={inputClass}
          name="description"
          defaultValue={event?.description ?? ""}
        />
      </Field>

      <Field label="Photo" error={errors.imageUrl}>
        <ImageUpload name="imageUrl" initialUrl={event?.imageUrl} />
      </Field>

      <Field
        label="Photo description"
        hint="Describe what is in the photo. Screen readers and search engines read this."
        error={errors.imageAlt}
      >
        <input
          className={inputClass}
          name="imageAlt"
          defaultValue={event?.imageAlt ?? ""}
        />
      </Field>

      <Field
        label="Button link"
        hint="Where the event card sends people. Defaults to the contact page."
        error={errors.href}
      >
        <input
          className={inputClass}
          name="href"
          placeholder="/contact"
          defaultValue={event?.href ?? ""}
        />
      </Field>

      {event?.videoUrl && (
        <p className="m-0 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white/55">
          This event shows a video ({event.videoUrl}). Videos are managed by
          your developer — everything else here is yours to edit.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
        <SubmitButton isNew={isNew} />
        <Link href="/admin/events" className="group">
          <span className="text-[13px] text-white/55 transition group-hover:text-white">
            Cancel
          </span>
        </Link>
      </div>
    </form>
  );
}
