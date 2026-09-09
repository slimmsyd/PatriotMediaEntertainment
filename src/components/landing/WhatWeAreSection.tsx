"use client";

import { whatWeAreCopy } from "@/lib/content-defaults";
import type { WhatWeAreCopyValue } from "@/lib/cms/schemas";
import { TricolorBar } from "@/components/ui/TricolorBar";

type WhatWeAreSectionProps = {
  copy?: WhatWeAreCopyValue;
};

export function WhatWeAreSection({
  copy = whatWeAreCopy,
}: WhatWeAreSectionProps) {
  return (
    <section
      id="what-we-are"
      className="relative z-[4] bg-near-black pt-[clamp(72px,9vw,104px)] pr-[clamp(28px,6vw,88px)] pb-[clamp(64px,8vw,96px)] pl-[clamp(28px,6vw,88px)] text-white"
      aria-label="What we are"
    >
      <TricolorBar
        width={168}
        height={3}
        className="mb-[clamp(28px,3.6vw,44px)]"
      />
      <h1 className="m-0 max-w-[20ch] text-[clamp(44px,6.6vw,96px)] font-semibold leading-[0.92] tracking-[-0.04em] text-pretty">
        {copy.headline}
      </h1>
      <p className="m-0 mt-[clamp(28px,3.2vw,40px)] max-w-[62ch] text-[clamp(17px,1.4vw,21px)] leading-[1.6] text-white/68 text-pretty">
        {copy.body}
      </p>
      <div className="mt-[clamp(40px,4.6vw,56px)] flex flex-wrap gap-[clamp(24px,4vw,56px)] border-t border-white/16 pt-8">
        {copy.marketMarkers.map((marker) => (
          <span
            key={marker.label}
            className={`text-[15px] font-bold tracking-[0.16em] uppercase ${
              "emphasis" in marker && marker.emphasis
                ? "text-red"
                : "text-white/50"
            }`}
          >
            {marker.label}
          </span>
        ))}
      </div>
    </section>
  );
}
