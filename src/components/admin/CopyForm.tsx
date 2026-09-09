"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveCopy } from "@/app/admin/actions";
import { emptyFormState, type FormState } from "@/lib/cms/form-state";
import {
  Banner,
  Field,
  PrimaryButton,
  inputClass,
} from "@/components/admin/ui";
import type { CopyGroupKey } from "@/lib/cms/schemas";

/** Plain-English names for the field keys the schemas use. */
const FIELD_LABELS: Record<string, string> = {
  name: "Company name",
  wordmark: "Wordmark",
  phone: "Phone number",
  addressLines: "Address",
  bookingsHours: "Bookings hours",
  label: "Button text",
  ariaLabel: "Screen-reader description",
  blurb: "Supporting sentence",
  itemName: "What the donation is for",
  eyebrow: "Small label above the heading",
  title: "Heading",
  headline: "Headline",
  lead: "Opening paragraph",
  detail: "Paragraphs",
  body: "Body text",
  cta: "Button text",
  ctaHref: "Button link",
  founderImage: "Portrait image path",
  founderImageAlt: "Portrait description",
  founderName: "Name under the portrait",
  founderRole: "Role under the portrait",
  marketMarkers: "Regions listed",
  titleLines: "Heading lines",
  button: "Button text",
  seeAll: "Link text",
  seeAllHref: "Link target",
  emphasis: "Highlight this one",
};

/** Fields that hold sentences rather than labels get a textarea. */
const LONG_FIELDS = new Set([
  "lead",
  "body",
  "blurb",
  "detail",
  "ariaLabel",
  "description",
]);

function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key;
}

type Json = string | boolean | Json[] | { [key: string]: Json };

function setAtPath(value: Json, path: (string | number)[], next: Json): Json {
  if (path.length === 0) return next;
  const [head, ...rest] = path;
  if (Array.isArray(value) && typeof head === "number") {
    const copy = [...value];
    copy[head] = setAtPath(copy[head], rest, next);
    return copy;
  }
  if (value && typeof value === "object" && typeof head === "string") {
    return {
      ...(value as Record<string, Json>),
      [head]: setAtPath((value as Record<string, Json>)[head], rest, next),
    };
  }
  return next;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </PrimaryButton>
  );
}

export function CopyForm({
  group,
  value: initialValue,
}: {
  group: CopyGroupKey;
  value: unknown;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    saveCopy,
    emptyFormState,
  );
  const [value, setValue] = useState<Json>(initialValue as Json);
  const errors = state.errors ?? {};

  const update = (path: (string | number)[], next: Json) =>
    setValue((current) => setAtPath(current, path, next));

  function renderNode(
    node: Json,
    path: (string | number)[],
    key: string,
  ): React.ReactNode {
    const pathKey = path.join(".");

    if (typeof node === "boolean") {
      return (
        <label
          key={pathKey}
          className="flex items-center gap-2 text-[13px] text-white/70"
        >
          <input
            type="checkbox"
            checked={node}
            onChange={(event) => update(path, event.target.checked)}
            className="h-4 w-4 accent-white"
          />
          {labelFor(key)}
        </label>
      );
    }

    if (typeof node === "string") {
      const multiline = LONG_FIELDS.has(key) || node.length > 90;
      return (
        <Field key={pathKey} label={labelFor(key)} error={errors[pathKey]}>
          {multiline ? (
            <textarea
              className={`${inputClass} min-h-[110px] resize-y leading-relaxed`}
              value={node}
              onChange={(event) => update(path, event.target.value)}
            />
          ) : (
            <input
              className={inputClass}
              value={node}
              onChange={(event) => update(path, event.target.value)}
            />
          )}
        </Field>
      );
    }

    if (Array.isArray(node)) {
      const template: Json =
        node.length > 0 && typeof node[0] === "object" && !Array.isArray(node[0])
          ? Object.fromEntries(
              Object.keys(node[0] as Record<string, Json>).map((k) => [
                k,
                typeof (node[0] as Record<string, Json>)[k] === "boolean"
                  ? false
                  : "",
              ]),
            )
          : "";

      return (
        <fieldset
          key={pathKey}
          className="m-0 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <legend className="px-1 text-[12px] font-medium tracking-[0.08em] text-white/70 uppercase">
            {labelFor(key)}
          </legend>
          {errors[pathKey] && (
            <p role="alert" className="mt-1 mb-2 text-[12px] text-[#ff8080]">
              {errors[pathKey]}
            </p>
          )}
          <div className="flex flex-col gap-4">
            {node.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  {typeof item === "object" && !Array.isArray(item) ? (
                    <div className="flex flex-col gap-3">
                      {Object.entries(item as Record<string, Json>).map(
                        ([childKey, childValue]) =>
                          renderNode(
                            childValue,
                            [...path, index, childKey],
                            childKey,
                          ),
                      )}
                    </div>
                  ) : (
                    renderNode(item, [...path, index], key)
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() =>
                    update(
                      path,
                      node.filter((_, i) => i !== index),
                    )
                  }
                  className="mt-6 h-9 w-9 shrink-0 rounded-full border border-white/15 text-white/45 transition hover:border-[#ff8080]/50 hover:text-[#ff8080]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update(path, [...node, template])}
            className="mt-4 rounded-full border border-white/20 px-4 py-2 text-[13px] text-white/75 transition hover:border-white/45 hover:text-white"
          >
            + Add another
          </button>
        </fieldset>
      );
    }

    return (
      <div key={pathKey} className="flex flex-col gap-5">
        {Object.entries(node as Record<string, Json>).map(
          ([childKey, childValue]) =>
            renderNode(childValue, [...path, childKey], childKey),
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <Banner tone="error">{state.message}</Banner>
      )}
      {state.status === "saved" && state.message && (
        <Banner tone="success">{state.message}</Banner>
      )}
      <input type="hidden" name="group" value={group} />
      {/* The nested shape goes over as JSON so repeatable lists survive the
          round trip without inventing a bracket-notation encoding. */}
      <input type="hidden" name="value" value={JSON.stringify(value)} />

      {renderNode(value, [], group)}

      <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
        <SubmitButton />
        <button
          type="button"
          onClick={() => setValue(initialValue as Json)}
          className="text-[13px] text-white/55 transition hover:text-white"
        >
          Undo my changes
        </button>
      </div>
    </form>
  );
}
