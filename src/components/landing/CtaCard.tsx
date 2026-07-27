"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ctaCopy } from "@/lib/content";
import { ChevronRightIcon } from "@/components/ui/icons";
import { TricolorBar } from "@/components/ui/TricolorBar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const charsRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const vh = window.innerHeight;
            const rect = card.getBoundingClientRect();
            const p = gsap.utils.clamp(
              0,
              1,
              (vh - rect.top) / (0.62 * vh + 0.25 * rect.height),
            );
            gsap.set(card, {
              opacity: Math.min(1, p * 2.2),
              y: 96 * (1 - p) - 34 * p,
              scale: 0.945 + 0.055 * p,
            });
          },
        });
      } else {
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      }

      const enter = () => {
        if (reduce) {
          gsap.set(
            [
              avatarsRef.current?.children,
              headlineRef.current,
              charsRef.current?.children,
              chipRef.current,
            ],
            { opacity: 1, y: 0, scale: 1 },
          );
          return;
        }

        const tl = gsap.timeline();
        const avatars = avatarsRef.current
          ? Array.from(avatarsRef.current.children)
          : [];
        const chars = charsRef.current
          ? Array.from(charsRef.current.children)
          : [];

        tl.fromTo(
          avatars,
          { y: 30, scale: 0.88, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.075,
            ease: "power2.out",
          },
        );
        tl.fromTo(
          headlineRef.current,
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          0.24,
        );
        tl.fromTo(
          chars,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.62,
            stagger: 0.034,
            ease: "power2.out",
          },
          0.46,
        );
        tl.fromTo(
          chipRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.62, ease: "power2.out" },
          0.82,
        );
      };

      ScrollTrigger.create({
        trigger: card,
        start: "top 78%",
        once: true,
        onEnter: enter,
      });
    },
    { scope: sectionRef },
  );

  const buttonChars = ctaCopy.button.split("");

  return (
    <section
      id="contact-cta"
      ref={sectionRef}
      className="relative z-[4] bg-off-white px-[clamp(16px,4vw,72px)] pt-[clamp(40px,8vh,110px)] pb-[clamp(48px,9vh,120px)]"
    >
      <div
        ref={cardRef}
        className="relative flex flex-col items-center gap-[clamp(34px,4.6vh,58px)] overflow-hidden rounded-[20px] bg-card-black px-[clamp(24px,5vw,80px)] py-[clamp(80px,17vh,210px)] text-white will-change-transform"
        style={{ opacity: 0, transform: "translateY(96px) scale(0.945)" }}
      >
        <TricolorBar height={3} className="absolute top-0 left-0" />

        <div ref={avatarsRef} className="flex items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`relative h-[clamp(78px,7.6vw,112px)] w-[clamp(78px,7.6vw,112px)] overflow-hidden rounded-full border-[3px] border-card-black bg-[#2A2A2A] opacity-0 ${
                i > 0 ? "-ml-5" : ""
              }`}
              data-slot={`cta-${i + 1}`}
              role="img"
              aria-label={`Team member ${i + 1}`}
            />
          ))}
        </div>

        <h2
          ref={headlineRef}
          className="m-0 max-w-[24ch] text-center text-[clamp(30px,3.3vw,56px)] font-medium leading-[1.14] tracking-[-0.02em] text-pretty opacity-0"
        >
          {ctaCopy.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2.5 rounded-xl bg-navy py-3.5 pr-3.5 pl-[30px] text-[clamp(15px,1.15vw,18px)] font-semibold transition-colors duration-200 hover:bg-navy-dark pme-focus-ring"
        >
          <span ref={charsRef} className="inline-flex">
            {buttonChars.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="inline-block opacity-0"
                style={{ whiteSpace: ch === " " ? "pre" : undefined }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
          <span
            ref={chipRef}
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border border-white/32 opacity-0"
          >
            <ChevronRightIcon />
          </span>
        </Link>
      </div>
    </section>
  );
}
