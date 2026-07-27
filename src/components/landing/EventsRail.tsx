"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { events } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function EventsRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!section || !pin || !track) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          const getDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          gsap.fromTo(
            pin,
            { scale: 0.82, opacity: 0.25 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            },
          );

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 600);
          const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 2000);

          return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
          };
        },
      );

      mm.add("(max-width: 900px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { clearProps: "transform" });
        gsap.set(pin, { clearProps: "transform,opacity" });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative z-[3] bg-black"
      aria-label="Past events"
    >
      <div
        ref={pinRef}
        className="flex h-screen items-center overflow-hidden bg-black will-change-transform max-[900px]:h-auto max-[900px]:py-16"
      >
        <div
          ref={trackRef}
          className="flex gap-[clamp(24px,3vw,56px)] px-[clamp(24px,4vw,72px)] will-change-transform max-[900px]:w-full max-[900px]:overflow-x-auto max-[900px]:scroll-smooth max-[900px]:snap-x max-[900px]:snap-mandatory pme-scrollbar-hide"
        >
          {events.map((event) => {
            const videoSrc = "video" in event ? event.video : undefined;

            return (
              <article
                key={event.id}
                className="relative h-[82vh] w-[min(72vw,1180px)] shrink-0 overflow-hidden rounded-[26px] bg-card-well max-[900px]:h-[70vh] max-[900px]:w-[86vw] max-[900px]:snap-center"
              >
                {videoSrc ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={event.title}
                  />
                ) : (
                  <ImagePlaceholder
                    id={event.id}
                    label={event.placeholder}
                    rounded="rounded-[26px]"
                    className="bg-card-well"
                  />
                )}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)",
                  }}
                />
                <div className="pointer-events-none absolute bottom-[clamp(28px,4vh,54px)] left-[clamp(24px,3vw,52px)] flex flex-col gap-1.5 text-white">
                  <span className="text-[15px] font-bold tracking-[0.04em]">
                    {event.eyebrow}
                  </span>
                  <h2 className="m-0 text-[clamp(38px,4.6vw,84px)] font-extrabold leading-[0.94] tracking-[-0.02em] text-pretty">
                    {event.title}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
