"use client";

import { DonateButton } from "@/components/donate/DonateButton";
import { donate } from "@/lib/content-defaults";

export function DonateBand() {
  return (
    <section
      id="donate"
      className="relative z-[4] bg-near-black px-[clamp(28px,6vw,88px)] py-[clamp(40px,6vw,64px)] text-white"
      aria-labelledby="donate-heading"
    >
      <div className="flex flex-col items-start justify-between gap-6 min-[720px]:flex-row min-[720px]:items-center">
        <div className="max-w-[42ch]">
          <p className="m-0 text-[13px] font-bold tracking-[0.18em] uppercase text-red">
            Contribute
          </p>
          <p
            id="donate-heading"
            className="mt-3 mb-0 text-[clamp(17px,1.4vw,20px)] leading-[1.5] text-pretty"
          >
            {donate.blurb}
          </p>
        </div>
        <DonateButton className="h-[50px] px-[26px] text-[13px] tracking-[0.16em] uppercase" />
      </div>
    </section>
  );
}
