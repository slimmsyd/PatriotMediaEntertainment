"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { upcomingCopy, upcomingEvents, type UpcomingEvent } from "@/lib/content";
import { ChevronRightIcon } from "@/components/ui/icons";
import { StepEyebrow } from "@/components/ui/StepEyebrow";

gsap.registerPlugin(useGSAP);

/** Two copies of the list = seamless loop when x resets by one set's pitch. */
const LOOP_SETS = 2;
/** Seconds for one full set to scroll past (lower = faster). */
const LOOP_DURATION = 28;
/**
 * Below this many cards a loop looks broken — one set can't span the viewport,
 * so the reset leaves a visible gap. Render a static row instead.
 */
const MARQUEE_MIN_CARDS = 4;

export function UpcomingEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      if (upcomingEvents.length < MARQUEE_MIN_CARDS) return;

      const setup = () => {
        tweenRef.current?.kill();
        gsap.set(track, { x: 0 });

        // One set's pitch, not scrollWidth/SETS: scrollWidth is short by one
        // gap (there are SETS*n-1 gaps, not SETS*n), which would drift the
        // seam by half a gap on every loop.
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const pitch = (track.scrollWidth + gap) / LOOP_SETS;
        if (pitch <= 0) return;

        tweenRef.current = gsap.to(track, {
          x: -pitch,
          duration: LOOP_DURATION,
          ease: "none",
          repeat: -1,
          force3D: true,
        });
      };

      setup();

      const onResize = () => setup();
      window.addEventListener("resize", onResize);

      const pause = () => tweenRef.current?.pause();
      const play = () => tweenRef.current?.play();

      viewport.addEventListener("pointerenter", pause);
      viewport.addEventListener("pointerleave", play);
      viewport.addEventListener("focusin", pause);
      viewport.addEventListener("focusout", play);

      return () => {
        window.removeEventListener("resize", onResize);
        viewport.removeEventListener("pointerenter", pause);
        viewport.removeEventListener("pointerleave", play);
        viewport.removeEventListener("focusin", pause);
        viewport.removeEventListener("focusout", play);
        tweenRef.current?.kill();
        tweenRef.current = null;
      };
    },
    { scope: sectionRef },
  );

  // No real dates on the books yet — hide the section rather than run an
  // empty marquee. It comes back on its own once upcomingEvents is populated.
  if (upcomingEvents.length === 0) return null;

  const marquee = upcomingEvents.length >= MARQUEE_MIN_CARDS;

  const loopItems = Array.from({ length: marquee ? LOOP_SETS : 1 }, (_, setIndex) =>
    upcomingEvents.map((event, index) => ({
      event,
      index,
      key: `${event.id}-set-${setIndex}`,
      /** Only the first set is exposed to assistive tech. */
      inert: setIndex > 0,
    })),
  ).flat();

  return (
    <section
      id="upcoming"
      ref={sectionRef}
      className="relative z-[4] scroll-mt-24 border-t border-line-light bg-white pt-[clamp(56px,9vh,110px)] pb-[clamp(64px,10vh,120px)] text-near-black"
      aria-labelledby="upcoming-heading"
    >
      {/* Header stays padded; marquee can bleed full width */}
      <div className="mb-[clamp(36px,5vh,56px)] flex flex-col gap-8 px-[clamp(24px,4vw,72px)] min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
        <div className="flex max-w-[18ch] flex-col gap-5 min-[900px]:max-w-none">
          <StepEyebrow label={upcomingCopy.eyebrow} />
          <h2
            id="upcoming-heading"
            className="m-0 text-[clamp(32px,4.2vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-pretty"
          >
            {upcomingCopy.title}
          </h2>
        </div>

        <Link
          href={upcomingCopy.seeAllHref}
          className="group inline-flex shrink-0 items-center gap-3 self-start text-[13px] font-bold tracking-[0.08em] uppercase text-near-black pme-link-red pme-focus-ring min-[900px]:self-auto"
        >
          {upcomingCopy.seeAll}
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-light bg-white text-near-black transition-colors duration-200 group-hover:border-red group-hover:bg-red group-hover:text-white">
            <ChevronRightIcon />
          </span>
        </Link>
      </div>

      {/* Marquee once there are enough cards to span the viewport; a padded
          static row below that, where a loop would only show its own seam. */}
      <div
        ref={viewportRef}
        className={marquee ? "relative overflow-hidden" : "relative"}
        {...(marquee
          ? {
              "aria-roledescription": "carousel",
              "aria-label":
                "Upcoming events, continuously scrolling. Hover or focus to pause.",
            }
          : {})}
      >
        <ul
          ref={trackRef}
          className={`m-0 flex list-none items-stretch gap-[clamp(18px,2.2vw,28px)] p-0 ${
            marquee
              ? "w-max will-change-transform"
              : "flex-wrap px-[clamp(24px,4vw,72px)]"
          }`}
        >
          {loopItems.map(({ event, index, key, inert }) => (
            <li
              key={key}
              className="w-[min(78vw,380px)] shrink-0 min-[700px]:w-[min(42vw,400px)] min-[1100px]:w-[min(30vw,420px)]"
              aria-hidden={inert || undefined}
              {...(inert ? { inert: true } : {})}
            >
              <EventCard event={event} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: UpcomingEvent; index: number }) {
  return (
    <Link
      href={event.href}
      className="group flex h-full cursor-pointer flex-col gap-5 rounded-[4px] pme-focus-ring"
      tabIndex={0}
    >
      {/* Portrait — event artwork is flyer-shaped, so the card is too. */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] bg-card-well">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          sizes="(max-width: 700px) 78vw, (max-width: 1100px) 42vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2.5">
          <time
            dateTime={toIsoDate(event.date)}
            className="text-[14px] font-medium tracking-[0.02em] text-muted"
          >
            {event.date}
          </time>
          <h3 className="m-0 text-[clamp(17px,1.35vw,20px)] font-semibold leading-[1.28] tracking-[-0.015em] text-pretty text-near-black transition-colors duration-200 group-hover:text-red">
            {event.title}
          </h3>
        </div>

        <span
          className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            index === 0
              ? "bg-near-black text-white group-hover:bg-red"
              : "bg-line-chip text-near-black group-hover:bg-red group-hover:text-white"
          }`}
          aria-hidden="true"
        >
          <ChevronRightIcon />
        </span>
      </div>
    </Link>
  );
}

/** Parse DD.MM.YYYY showcase dates into a rough ISO date for semantics. */
function toIsoDate(display: string) {
  const [dd, mm, yyyy] = display.split(".");
  if (!dd || !mm || !yyyy) return undefined;
  return `${yyyy}-${mm}-${dd}`;
}
