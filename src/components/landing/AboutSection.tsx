"use client";

import Image from "next/image";
import { aboutCopy } from "@/lib/content";
import { ChipButton } from "@/components/ui/ChipButton";
import { StepEyebrow } from "@/components/ui/StepEyebrow";
import { TricolorBar } from "@/components/ui/TricolorBar";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-[4] overflow-hidden bg-off-white text-near-black pt-[clamp(72px,11vh,150px)] pb-[clamp(72px,12vh,160px)]"
      aria-label="About"
    >
      <TricolorBar className="absolute top-0 left-0" />

      <div className="grid items-start gap-[clamp(32px,5vw,96px)] pl-[clamp(24px,8vw,132px)] pr-[clamp(24px,4vw,72px)] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(320px,38%)_1fr]">
        {/* Story copy + CTA */}
        <div className="flex flex-col gap-[clamp(24px,3vh,40px)] pr-[clamp(16px,2vw,32px)]">
          <StepEyebrow label={aboutCopy.eyebrow} />
          <h2 className="m-0 text-[clamp(38px,4.4vw,76px)] font-medium leading-[1.04] tracking-[-0.02em] text-pretty">
            {aboutCopy.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="m-0 max-w-[34ch] text-[clamp(17px,1.25vw,21px)] leading-[1.55] text-ink text-pretty">
            {aboutCopy.body}
          </p>
          <div className="pt-1">
            <ChipButton
              href={aboutCopy.ctaHref}
              className="self-start py-3.5 pr-3.5 pl-[28px] text-[15px] tracking-[0.04em] text-white hover:text-white"
              chip="›"
            >
              {aboutCopy.cta}
            </ChipButton>
          </div>
        </div>

        {/* Single founder photo + critical red underline */}
        <div className="flex min-w-0 flex-col">
          <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-[14px] bg-line-light max-[900px]:aspect-[4/3.4]">
            <Image
              src={aboutCopy.founderImage}
              alt={aboutCopy.founderImageAlt}
              fill
              sizes="(max-width: 900px) 92vw, 58vw"
              className="object-cover object-[center_18%]"
              priority={false}
            />
          </div>

          {/* Red underline track — kept as a signature mark */}
          <div
            className="mt-[clamp(28px,4vh,48px)] h-[3px] w-full bg-near-black/10"
            aria-hidden="true"
          >
            <div className="h-full w-full bg-red" />
          </div>
        </div>
      </div>
    </section>
  );
}
