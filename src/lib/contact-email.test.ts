import { describe, expect, it } from "vitest";
import {
  ACCOUNT_CC,
  buildAccountEmail,
  buildCustomerEmail,
  parseContactInput,
} from "./contact-email";

const valid = {
  subject: "Book an event",
  lastName: "Sans",
  firstName: "Reggie",
  organization: "Patriot Entertainment",
  email: "reggie@example.com",
  phone: "5409907868",
  message: "We want to book a benefit show.",
  consent: true,
};

describe("parseContactInput", () => {
  it("rejects a submission with no customer email", () => {
    const result = parseContactInput({ ...valid, email: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toMatch(/required/i);
  });

  it("accepts a complete enquiry", () => {
    const result = parseContactInput(valid);
    expect(result).toEqual({ ok: true, data: valid });
  });
});

describe("contact emails", () => {
  it("builds a short confirmation for the customer", () => {
    const email = buildCustomerEmail(valid);
    expect(email.to).toBe("reggie@example.com");
    expect(email.subject).toMatch(/got your message/i);
    expect(email.text).toContain("Reggie");
    expect(email.text).toContain("Book an event");
    expect(email.text.length).toBeLessThan(500);
  });

  it("builds an account enquiry that always CCs patriotmedia2026@gmail.com", () => {
    const email = buildAccountEmail(valid);
    expect(email.to).toBe("hello@patriotmediausa.com");
    expect(email.cc).toEqual([ACCOUNT_CC]);
    expect(email.replyTo).toBe("reggie@example.com");
    expect(email.subject).toBe("New enquiry — Book an event");
    expect(email.text).toContain("Patriot Entertainment");
    expect(email.text).toContain("We want to book a benefit show.");
  });
});
