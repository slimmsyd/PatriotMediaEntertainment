export const ACCOUNT_INBOX = "hello@patriotmediausa.com";
export const ACCOUNT_CC = "patriotmedia2026@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactEnquiry = {
  subject: string;
  lastName: string;
  firstName: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

export type ParseResult =
  | { ok: true; data: ContactEnquiry }
  | { ok: false; errors: Record<string, string> };

export type ContactEmail = {
  to: string;
  from?: string;
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactInput(input: unknown): ParseResult {
  const body =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};

  const subject = str(body.subject);
  const lastName = str(body.lastName);
  const firstName = str(body.firstName);
  const organization = str(body.organization);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const message = str(body.message);
  const consent = body.consent === true || body.consent === "true";

  if (!subject) errors.subject = "Subject is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!firstName) errors.firstName = "First name is required.";
  if (!organization) errors.organization = "Organization is required.";
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email.";
  if (!consent) errors.consent = "Consent is required.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      subject,
      lastName,
      firstName,
      organization,
      email,
      phone,
      message,
      consent,
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapHtml(body: string): string {
  return `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.5;color:#0A0A0A">${body}</div>`;
}

export function buildCustomerEmail(enquiry: ContactEnquiry): ContactEmail {
  const text = [
    `Hi ${enquiry.firstName},`,
    "",
    `Thanks for reaching out about ${enquiry.subject}. We received your note and will reply shortly.`,
    "",
    "— Patriot Entertainment & Media Group",
  ].join("\n");

  return {
    to: enquiry.email,
    subject: "We got your message",
    text,
    html: wrapHtml(
      `<p>Hi ${escapeHtml(enquiry.firstName)},</p><p>Thanks for reaching out about <strong>${escapeHtml(enquiry.subject)}</strong>. We received your note and will reply shortly.</p><p>— Patriot Entertainment &amp; Media Group</p>`,
    ),
  };
}

export function buildAccountEmail(enquiry: ContactEnquiry): ContactEmail {
  const lines = [
    `${enquiry.firstName} ${enquiry.lastName}`,
    enquiry.organization,
    enquiry.email,
    enquiry.phone || "No phone",
    "",
    enquiry.message || "No message",
  ];

  return {
    to: ACCOUNT_INBOX,
    cc: [ACCOUNT_CC],
    replyTo: enquiry.email,
    subject: `New enquiry — ${enquiry.subject}`,
    text: lines.join("\n"),
    html: wrapHtml(
      [
        `<p><strong>${escapeHtml(enquiry.firstName)} ${escapeHtml(enquiry.lastName)}</strong><br>${escapeHtml(enquiry.organization)}<br>${escapeHtml(enquiry.email)}<br>${escapeHtml(enquiry.phone || "No phone")}</p>`,
        `<p>${escapeHtml(enquiry.message || "No message").replaceAll("\n", "<br>")}</p>`,
      ].join(""),
    ),
  };
}

export function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error(
      'RESEND_FROM_EMAIL is not set. Example: "Patriot Entertainment & Media Group <hello@patriotmediausa.com>"',
    );
  }
  return from;
}

export async function sendContactEmails(enquiry: ContactEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = getFromAddress();
  const account = buildAccountEmail(enquiry);
  const customer = buildCustomerEmail(enquiry);

  const accountResult = await resend.emails.send({
    from,
    to: account.to,
    cc: account.cc,
    replyTo: account.replyTo,
    subject: account.subject,
    text: account.text,
    html: account.html,
  });
  if (accountResult.error) {
    throw new Error(accountResult.error.message);
  }

  const customerResult = await resend.emails.send({
    from,
    to: customer.to,
    subject: customer.subject,
    text: customer.text,
    html: customer.html,
  });
  if (customerResult.error) {
    console.error("[contact] customer confirmation failed", customerResult.error);
  }
}
