"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ctaCopy, partnerLogos } from "@/lib/content-defaults";
import { FLAG_BG_VIDEO, FLAG_POSTER } from "@/lib/media";
import { ChevronRightIcon } from "@/components/ui/icons";
import { TricolorBar } from "@/components/ui/TricolorBar";
import { InViewVideo } from "@/components/ui/InViewVideo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
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
          onUpdate: () => {
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
              logosRef.current?.children,
              headlineRef.current,
              charsRef.current?.children,
              chipRef.current,
            ],
            { opacity: 1, y: 0, scale: 1 },
          );
          return;
        }

        const tl = gsap.timeline();
        const logos = logosRef.current
          ? Array.from(logosRef.current.children)
          : [];
        const chars = charsRef.current
          ? Array.from(charsRef.current.children)
          : [];

        tl.fromTo(
          logos,
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
        {/* Flag video background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <InViewVideo
            src={FLAG_BG_VIDEO}
            poster={FLAG_POSTER}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            aria-label=""
            loadRootMargin="80% 0px 80% 0px"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </div>

        <TricolorBar height={3} className="absolute top-0 left-0 z-[1]" />

        {/* Horizontal U.S. military branch seal stack */}
        <div
          ref={logosRef}
          className="relative z-[1] flex max-w-full flex-wrap items-center justify-center gap-y-2 px-2"
          role="list"
          aria-label="United States military branches"
        >
          {partnerLogos.map((logo, i) => (
            <div
              key={logo.id}
              role="listitem"
              className={`relative flex h-[clamp(68px,7vw,100px)] w-[clamp(68px,7vw,100px)] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/20 bg-white opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${
                i > 0 ? "-ml-3 min-[700px]:-ml-4" : ""
              }`}
              style={{ zIndex: partnerLogos.length - i }}
              title={logo.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="h-[82%] w-[82%] object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <h2
          ref={headlineRef}
          className="relative z-[1] m-0 max-w-[24ch] text-center text-[clamp(30px,3.3vw,56px)] font-medium leading-[1.14] tracking-[-0.02em] text-pretty opacity-0"
        >
          {ctaCopy.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <Link
          href="/contact"
          className="relative z-[1] inline-flex items-center gap-2.5 rounded-xl bg-navy py-3.5 pr-3.5 pl-[30px] text-[clamp(15px,1.15vw,18px)] font-semibold text-white transition-colors duration-200 hover:bg-red hover:text-white pme-focus-ring"
        >
          <span ref={charsRef} className="inline-flex text-white">
            {buttonChars.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="inline-block text-white opacity-0"
                style={{ whiteSpace: ch === " " ? "pre" : undefined }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
          <span
            ref={chipRef}
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border border-white/32 text-white opacity-0"
          >
            <ChevronRightIcon />
          </span>
        </Link>
      </div>
    </section>
  );
}
