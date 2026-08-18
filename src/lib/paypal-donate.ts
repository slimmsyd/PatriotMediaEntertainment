export type PayPalDonateEnv = "sandbox" | "production";

export type PayPalDonateConfig = {
  env: PayPalDonateEnv;
  hostedButtonId?: string;
  business?: string;
};

export type PayPalDonateComplete = {
  tx?: string;
  st?: string;
  amt?: string;
  cc?: string;
  cm?: string;
  item_number?: string;
  item_name?: string;
};

type EnvLike = Record<string, string | undefined>;

function trim(value: string | undefined): string | undefined {
  const next = value?.trim();
  return next ? next : undefined;
}

export function readPayPalDonateConfig(
  env: EnvLike = process.env,
): PayPalDonateConfig | null {
  const hostedButtonId = trim(env.NEXT_PUBLIC_PAYPAL_DONATE_HOSTED_BUTTON_ID);
  const business = trim(env.NEXT_PUBLIC_PAYPAL_DONATE_BUSINESS);
  if (!hostedButtonId && !business) return null;

  const rawEnv = trim(env.NEXT_PUBLIC_PAYPAL_DONATE_ENV)?.toLowerCase();
  const donateEnv: PayPalDonateEnv =
    rawEnv === "sandbox" ? "sandbox" : "production";

  return {
    env: donateEnv,
    hostedButtonId,
    business,
  };
}

/**
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when the key is a
 * static member access. Passing `process.env` into a helper leaves the
 * client bundle empty, so these reads stay here on purpose.
 *
 * The hosted button id is public (it is already in the donate URL).
 * Env can still override it for sandbox / another account.
 */
const LIVE_HOSTED_BUTTON_ID = "83RMQ8WVVC4TQ";

export function getPayPalDonateConfig(): PayPalDonateConfig | null {
  return readPayPalDonateConfig({
    NEXT_PUBLIC_PAYPAL_DONATE_HOSTED_BUTTON_ID:
      process.env.NEXT_PUBLIC_PAYPAL_DONATE_HOSTED_BUTTON_ID ||
      LIVE_HOSTED_BUTTON_ID,
    NEXT_PUBLIC_PAYPAL_DONATE_BUSINESS:
      process.env.NEXT_PUBLIC_PAYPAL_DONATE_BUSINESS,
    NEXT_PUBLIC_PAYPAL_DONATE_ENV: process.env.NEXT_PUBLIC_PAYPAL_DONATE_ENV,
  });
}

export function paypalDonateHref(config: PayPalDonateConfig): string {
  const host =
    config.env === "sandbox"
      ? "https://www.sandbox.paypal.com/donate"
      : "https://www.paypal.com/donate";
  const params = new URLSearchParams();
  if (config.hostedButtonId) {
    params.set("hosted_button_id", config.hostedButtonId);
  } else if (config.business) {
    params.set("business", config.business);
  }
  return `${host}/?${params.toString()}`;
}

declare global {
  interface Window {
    PayPal?: {
      Donation: {
        Button: (options: {
          env?: PayPalDonateEnv;
          hosted_button_id?: string;
          business?: string;
          item_name?: string;
          image?: {
            src: string;
            title?: string;
            alt?: string;
          };
          onComplete?: (params: PayPalDonateComplete) => void;
        }) => { render: (selector: string) => void };
      };
    };
  }
}
