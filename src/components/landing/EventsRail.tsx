"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { events } from "@/lib/content";
import { InViewVideo } from "@/components/ui/InViewVideo";

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

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

      // Desktop: scroll-scrubbed horizontal pin
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

      // Mobile / reduced motion: free GSAP drag (press + drag left/right)
      mm.add(
        "(max-width: 900px), (prefers-reduced-motion: reduce)",
        () => {
          gsap.set(pin, { clearProps: "transform,opacity" });
          gsap.set(track, { x: 0 });

          const getMinX = () => {
            const maxScroll = Math.max(0, track.scrollWidth - pin.clientWidth);
            return -maxScroll;
          };

          let lastX = 0;
          let lastT = 0;
          let velocity = 0;
          let throwTween: gsap.core.Tween | null = null;

          const clampX = (x: number) =>
            gsap.utils.clamp(getMinX(), 0, x);

          const [drag] = Draggable.create(track, {
            type: "x",
            trigger: pin,
            bounds: { minX: getMinX(), maxX: 0 },
            edgeResistance: 0.82,
            dragClickables: true,
            allowContextMenu: false,
            zIndexBoost: false,
            cursor: "grab",
            activeCursor: "grabbing",
            onPress() {
              throwTween?.kill();
              throwTween = null;
              lastX = this.x;
              lastT = performance.now();
              velocity = 0;
              pin.classList.add("is-dragging");
              // Refresh bounds in case layout/videos changed
              this.applyBounds({ minX: getMinX(), maxX: 0 });
            },
            onDrag() {
              const now = performance.now();
              const dt = Math.max(1, now - lastT);
              // px / ms → px / s
              velocity = ((this.x - lastX) / dt) * 1000;
              lastX = this.x;
              lastT = now;
            },
            onRelease() {
              pin.classList.remove("is-dragging");
            },
            onDragEnd() {
              pin.classList.remove("is-dragging");

              // Throw / inertia without Club InertiaPlugin
              const projected = clampX(this.x + velocity * 0.35);
              const dist = Math.abs(projected - this.x);
              if (dist < 4) {
                // Nudge into bounds if released past edge
                gsap.to(track, {
                  x: clampX(this.x),
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: true,
                });
                return;
              }

              const duration = gsap.utils.clamp(0.35, 1.1, dist / 900);
              throwTween = gsap.to(track, {
                x: projected,
                duration,
                ease: "power3.out",
                overwrite: true,
                onUpdate: () => {
                  // Keep Draggable's internal x in sync for next press
                  drag.update();
                },
              });
            },
          });

          const onResize = () => {
            const minX = getMinX();
            const x = clampX(Number(gsap.getProperty(track, "x")) || 0);
            gsap.set(track, { x });
            drag.applyBounds({ minX, maxX: 0 });
            drag.update(true);
          };

          window.addEventListener("resize", onResize);
          // Layout after videos/fonts
          const t1 = window.setTimeout(onResize, 200);
          const t2 = window.setTimeout(onResize, 800);

          return () => {
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            window.removeEventListener("resize", onResize);
            throwTween?.kill();
            pin.classList.remove("is-dragging");
            drag.kill();
            gsap.set(track, { clearProps: "transform,cursor" });
          };
        },
      );

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
        className="pme-events-pin flex h-screen items-center overflow-hidden bg-black will-change-transform max-[900px]:h-auto max-[900px]:py-16 max-[900px]:cursor-grab max-[900px]:select-none max-[900px]:active:cursor-grabbing"
      >
        <div
          ref={trackRef}
          className="pme-events-track flex gap-[clamp(24px,3vw,56px)] px-[clamp(24px,4vw,72px)] will-change-transform max-[900px]:w-max"
        >
          {events.map((event) =>
            event.kind === "film" ? (
              <article
                key={event.id}
                className="relative h-[82vh] w-[min(72vw,1180px)] shrink-0 overflow-hidden rounded-[26px] bg-card-well max-[900px]:h-[70vh] max-[900px]:w-[86vw]"
              >
                <div
                  className="absolute inset-0 bg-card-well bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.poster})` }}
                  aria-hidden="true"
                />
                <InViewVideo
                  src={event.video}
                  poster={event.poster}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover max-[900px]:pointer-events-none"
                  aria-label={event.title}
                  loadRootMargin="160% 0px 160% 0px"
                />
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
            ) : (
              /* Flyers carry their own typography, so the caption sits below
                 the artwork instead of overlaying and fighting it. */
              <article
                key={event.id}
                className="flex h-[82vh] w-[min(46vw,720px)] shrink-0 flex-col overflow-hidden rounded-[26px] bg-card-well max-[900px]:h-[70vh] max-[900px]:w-[76vw]"
              >
                <div className="relative min-h-0 flex-1">
                  {/* Blurred fill of the flyer itself — no dead letterbox bars. */}
                  <div
                    className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl brightness-[0.35]"
                    style={{ backgroundImage: `url(${event.image})` }}
                    aria-hidden="true"
                  />
                  <Image
                    src={event.image}
                    alt={event.imageAlt}
                    fill
                    sizes="(max-width: 900px) 76vw, 46vw"
                    className="object-contain"
                    draggable={false}
                  />
                </div>
                <div className="flex shrink-0 flex-col gap-1.5 bg-black px-[clamp(20px,2.4vw,34px)] py-[clamp(18px,2.2vh,26px)] text-white">
                  <span className="text-[14px] font-bold tracking-[0.04em] text-white/70">
                    {event.eyebrow}
                  </span>
                  <h2 className="m-0 text-[clamp(24px,2.3vw,38px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-pretty">
                    {event.title}
                  </h2>
                  <p className="m-0 text-[clamp(13px,0.95vw,15px)] font-medium text-white/65">
                    {event.meta}
                  </p>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
