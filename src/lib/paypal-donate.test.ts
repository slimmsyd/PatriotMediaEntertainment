import { describe, expect, it } from "vitest";
import {
  getPayPalDonateConfig,
  paypalDonateHref,
  readPayPalDonateConfig,
} from "./paypal-donate";

describe("readPayPalDonateConfig", () => {
  it("returns null when neither id nor business is set", () => {
    expect(readPayPalDonateConfig({})).toBeNull();
  });

  it("reads a hosted button id and defaults to production", () => {
    expect(
      readPayPalDonateConfig({
        NEXT_PUBLIC_PAYPAL_DONATE_HOSTED_BUTTON_ID: " ABC123 ",
      }),
    ).toEqual({
      env: "production",
      hostedButtonId: "ABC123",
      business: undefined,
    });
  });

  it("accepts sandbox + business email", () => {
    expect(
      readPayPalDonateConfig({
        NEXT_PUBLIC_PAYPAL_DONATE_BUSINESS: "giver@example.com",
        NEXT_PUBLIC_PAYPAL_DONATE_ENV: "sandbox",
      }),
    ).toEqual({
      env: "sandbox",
      hostedButtonId: undefined,
      business: "giver@example.com",
    });
  });
});

describe("getPayPalDonateConfig", () => {
  it("falls back to the live hosted button id", () => {
    expect(getPayPalDonateConfig()).toEqual({
      env: "production",
      hostedButtonId: "83RMQ8WVVC4TQ",
      business: undefined,
    });
  });
});

describe("paypalDonateHref", () => {
  it("builds a live hosted-button URL", () => {
    expect(
      paypalDonateHref({ env: "production", hostedButtonId: "ABC123" }),
    ).toBe("https://www.paypal.com/donate/?hosted_button_id=ABC123");
  });

  it("builds a sandbox business URL", () => {
    expect(
      paypalDonateHref({ env: "sandbox", business: "giver@example.com" }),
    ).toBe(
      "https://www.sandbox.paypal.com/donate/?business=giver%40example.com",
    );
  });
});
