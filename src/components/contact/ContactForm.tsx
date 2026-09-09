"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  contactSubjects,
  site as defaultSite,
} from "@/lib/content-defaults";
import type { SiteCopyValue } from "@/lib/cms/schemas";
import { CheckIcon, PaperPlaneIcon } from "@/components/ui/icons";

const MAX_MESSAGE = 348;

type ContactFormProps = {
  site?: SiteCopyValue;
};

export function ContactForm({ site = defaultSite }: ContactFormProps) {
  const listboxId = useId();
  const [subject, setSubject] = useState<string>(contactSubjects[0]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [messageLen, setMessageLen] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(
        Math.max(
          0,
          contactSubjects.findIndex((s) => s === subject),
        ),
      );
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(contactSubjects.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSubject(contactSubjects[activeIndex]);
      close();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || sent) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    const lastName = String(data.get("lastName") ?? "").trim();
    const firstName = String(data.get("firstName") ?? "").trim();
    const organization = String(data.get("organization") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent");

    if (!subject) next.subject = "Subject is required.";
    if (!lastName) next.lastName = "Last name is required.";
    if (!firstName) next.firstName = "First name is required.";
    if (!organization) next.organization = "Organization is required.";
    if (!email) next.email = "Email is required.";
    if (!consent) next.consent = "Consent is required.";

    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          lastName,
          firstName,
          organization,
          email,
          phone,
          message,
          consent: true,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        errors?: Record<string, string>;
        error?: string;
      };
      if (!res.ok) {
        if (payload.errors) setErrors(payload.errors);
        setSubmitError(payload.error ?? "Could not send your message. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-near-black/14 bg-white px-6 py-[22px] text-lg font-semibold text-near-black placeholder:text-placeholder focus:border-navy focus:outline-none";
  const labelClass = "text-[15px] font-semibold text-label";
  const errorClass = "text-[14px] text-red";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-[clamp(22px,3vh,32px)]"
      noValidate
    >
      <div className="flex flex-col gap-2.5" ref={dropdownRef}>
        <span className={labelClass}>
          Subject<span className="text-red">*</span>
        </span>
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={onTriggerKeyDown}
            className={`${fieldClass} flex cursor-pointer items-center justify-between gap-4 py-4 pr-4 pl-[26px] text-left hover:border-navy ${
              errors.subject ? "border-red" : ""
            }`}
          >
            {subject}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-line-chip">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                aria-hidden="true"
                className={`block transition-transform duration-[260ms] ease-out ${
                  open ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="#0A0A0A"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </button>
          {open && (
            <div
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={`subject-opt-${activeIndex}`}
              onKeyDown={onListKeyDown}
              className="absolute top-[calc(100%+8px)] right-0 left-0 z-10 flex flex-col rounded-xl border border-near-black/12 bg-white p-2 shadow-[0_24px_48px_rgba(10,10,10,0.14)]"
            >
              {contactSubjects.map((opt, i) => {
                const selected = opt === subject;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    id={`subject-opt-${i}`}
                    aria-selected={selected}
                    onClick={() => {
                      setSubject(opt);
                      close();
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border-0 px-[18px] py-[15px] text-left text-[17px] font-semibold text-near-black ${
                      selected || activeIndex === i
                        ? "bg-off-white"
                        : "bg-transparent"
                    } hover:bg-off-white`}
                  >
                    {opt}
                    <CheckIcon
                      className={selected ? "text-navy opacity-100" : "opacity-0"}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {errors.subject && <span className={errorClass}>{errors.subject}</span>}
      </div>

      <div className="grid gap-[clamp(20px,2vw,32px)] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>
            Last Name<span className="text-red">*</span>
          </span>
          <input
            name="lastName"
            type="text"
            required
            className={`${fieldClass} ${errors.lastName ? "border-red" : ""}`}
          />
          {errors.lastName && (
            <span className={errorClass}>{errors.lastName}</span>
          )}
        </label>
        <label className="flex flex-col gap-2.5">
          <span className={labelClass}>
            First Name<span className="text-red">*</span>
          </span>
          <input
            name="firstName"
            type="text"
            required
            className={`${fieldClass} ${errors.firstName ? "border-red" : ""}`}
          />
          {errors.firstName && (
            <span className={errorClass}>{errors.firstName}</span>
          )}
        </label>
      </div>

      <label className="flex flex-col gap-2.5">
        <span className={labelClass}>
          Organization<span className="text-red">*</span>
        </span>
        <input
          name="organization"
          type="text"
          required
          className={`${fieldClass} ${errors.organization ? "border-red" : ""}`}
        />
        {errors.organization && (
          <span className={errorClass}>{errors.organization}</span>
        )}
      </label>

      <label className="flex flex-col gap-2.5">
        <span className={labelClass}>
          Email<span className="text-red">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          className={`${fieldClass} ${errors.email ? "border-red" : ""}`}
        />
        {errors.email && <span className={errorClass}>{errors.email}</span>}
      </label>

      <label className="flex flex-col gap-2.5">
        <span className={labelClass}>Your Phone</span>
        <span className="flex items-center overflow-hidden rounded-xl border border-near-black/14 bg-white">
          <span className="flex items-center gap-2.5 px-5 py-[22px]">
            <span
              className="inline-flex h-[17px] w-[26px] overflow-hidden rounded-[2px] border border-near-black/12"
              aria-hidden="true"
            >
              <span className="flex-1 bg-red" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-navy" />
            </span>
            <span className="text-[17px] font-semibold">+1</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M7 10l5 5 5-5" stroke="#6E6E70" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="h-[30px] w-px bg-near-black/14" aria-hidden="true" />
          <input
            name="phone"
            type="tel"
            placeholder="000 000 0000"
            className="min-w-0 flex-1 border-0 bg-transparent px-6 py-[22px] text-lg font-semibold text-near-black placeholder:text-placeholder focus:outline-none"
          />
        </span>
      </label>

      <label className="flex flex-col gap-2.5">
        <span className={labelClass}>Message</span>
        <textarea
          name="message"
          rows={7}
          maxLength={MAX_MESSAGE}
          placeholder="Your message here (maximum 348 characters)"
          onChange={(e) => setMessageLen(e.target.value.length)}
          className="w-full resize-y rounded-xl border border-near-black/14 bg-white px-6 py-[26px] text-lg font-medium leading-[1.55] text-near-black placeholder:text-placeholder focus:border-navy focus:outline-none"
        />
        <span className="self-end text-sm text-placeholder">
          {messageLen} / {MAX_MESSAGE}
        </span>
      </label>

      <label className="flex items-start gap-3.5 text-[15px] leading-[1.55] text-muted">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 accent-navy"
        />
        <span>
          I agree to be contacted by {site.name} about my enquiry.
        </span>
      </label>
      {errors.consent && <span className={errorClass}>{errors.consent}</span>}

      {submitError && <span className={errorClass}>{submitError}</span>}

      <button
        type="submit"
        disabled={sending || sent}
        className="inline-flex cursor-pointer items-center gap-3.5 self-start rounded-xl bg-navy py-[18px] pr-[18px] pl-[34px] text-base font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-200 hover:bg-red pme-focus-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending" : "Send"}
        <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-white/22">
          <PaperPlaneIcon />
        </span>
      </button>

      <span
        className={`text-[15px] text-navy transition-opacity duration-400 ease-out ${
          sent ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
      >
        Thanks, we&apos;ll be in touch shortly.
      </span>
    </form>
  );
}
