"use client";

import {
  getPayPalDonateConfig,
  paypalDonateHref,
} from "@/lib/paypal-donate";

/** Opens the hosted PayPal donate page in a popup. Kept out of the root
 *  layout on purpose — wrapping <html>/<body> with next/script broke
 *  Next 16.2's React Client Manifest (global-error.js). */
export function openDonate() {
  const config = getPayPalDonateConfig();
  if (!config) return;
  window.open(
    paypalDonateHref(config),
    "paypalDonate",
    "noopener,noreferrer,width=500,height=740,scrollbars=yes,resizable=yes",
  );
}
