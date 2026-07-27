"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { aboutCopy, milestones } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StepEyebrow } from "@/components/ui/StepEyebrow";
import { TricolorBar } from "@/components/ui/TricolorBar";

gsap.registerPlugin(useGSAP);

export function AboutSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const max = milestones.length - 1;

  useGSAP(
    () => {
      const track = trackRef.current;
      const first = cardsRef.current[0];
      const current = cardsRef.current[index];
      if (!track || !first || !current) return;

      const x = -(current.offsetLeft - first.offsetLeft);
      gsap.to(track, {
        x,
        duration: 0.62,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    { dependencies: [index], revertOnUpdate: false },
  );

  return (
    <section
      id="about"
      className="relative z-[4] overflow-hidden bg-off-white text-near-black pt-[clamp(72px,11vh,150px)] pb-[clamp(72px,12vh,160px)]"
      aria-label="About"
    >
      <TricolorBar className="absolute top-0 left-0" />

      <div className="grid items-start gap-[clamp(32px,5vw,96px)] pl-[clamp(24px,8vw,132px)] max-[900px]:grid-cols-1 max-[900px]:pr-[clamp(24px,4vw,72px)] min-[901px]:grid-cols-[minmax(320px,34%)_1fr]">
        <div className="flex flex-col gap-[clamp(24px,3vh,40px)] pr-[clamp(16px,2vw,32px)]">
          <StepEyebrow label={aboutCopy.eyebrow} />
          <h2 className="m-0 text-[clamp(38px,4.4vw,76px)] font-medium leading-[1.04] tracking-[-0.02em] text-pretty">
            {aboutCopy.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="m-0 max-w-[30ch] text-[clamp(17px,1.25vw,21px)] leading-[1.55] text-ink text-pretty">
            {aboutCopy.body}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous milestone"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="flex h-[62px] w-[62px] items-center justify-center rounded-[10px] text-xl text-white transition-colors duration-200 disabled:cursor-default disabled:bg-disabled enabled:cursor-pointer enabled:bg-near-black enabled:hover:bg-navy pme-focus-ring"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next milestone"
              disabled={index === max}
              onClick={() => setIndex((i) => Math.min(max, i + 1))}
              className="flex h-[62px] w-[62px] items-center justify-center rounded-[10px] text-xl text-white transition-colors duration-200 disabled:cursor-default disabled:bg-disabled enabled:cursor-pointer enabled:bg-near-black enabled:hover:bg-red pme-focus-ring"
            >
              ›
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-[clamp(20px,2vw,36px)] will-change-transform"
          >
            {milestones.map((m, i) => (
              <article
                key={m.id}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="flex w-[min(38vw,620px)] shrink-0 flex-col gap-[22px] max-[900px]:w-[min(86vw,420px)]"
              >
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-[14px] bg-line-light">
                  <ImagePlaceholder
                    id={m.id}
                    label={m.placeholder}
                    rounded="rounded-[14px]"
                  />
                </div>
                <h3 className="m-0 text-[clamp(26px,2.2vw,38px)] font-medium">
                  {m.year}
                </h3>
                <p className="m-0 max-w-[34ch] text-[clamp(16px,1.15vw,19px)] leading-[1.55] text-ink text-pretty">
                  {m.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-[clamp(36px,5vh,64px)] h-[3px] w-full bg-near-black/10">
            <div
              className="h-full bg-red transition-[width] duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ width: `${((index + 1) / milestones.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
