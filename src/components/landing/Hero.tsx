"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SITE_BG_VIDEO } from "@/lib/media";
import { SpeakerIcon } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HOLD_MS = 1400;

type HeroProps = {
  /** Resume playback from loader so audio continues seamlessly. */
  startAt?: number;
  soundOn?: boolean;
  /** When false (during loader), hero video stays paused so audio isn't doubled. */
  active?: boolean;
};

export function Hero({
  startAt = 0,
  soundOn = true,
  active = true,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdBarRef = useRef<HTMLDivElement>(null);
  const [holding, setHolding] = useState(false);
  const [holdComplete, setHoldComplete] = useState(false);
  const [muted, setMuted] = useState(!soundOn);
  const holdTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      return;
    }

    video.muted = muted;
    video.defaultMuted = muted;
    video.volume = 1;

    const applyAndPlay = async () => {
      try {
        if (startAt > 0 && Number.isFinite(startAt)) {
          video.currentTime = startAt;
        }
        video.muted = muted;
        await video.play();
      } catch {
        const unlock = () => {
          video.muted = muted;
          video.volume = 1;
          void video.play().catch(() => undefined);
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
      }
    };

    void applyAndPlay();
  }, [startAt, active, muted]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.fromTo(
        section,
        { scale: 1, opacity: 1, transformOrigin: "50% 42%" },
        {
          scale: 0.84,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.85}`,
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      // Don't steal space when focused on a button/input
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (holdComplete) return;
      setHolding(true);
      holdTween.current?.kill();
      holdTween.current = gsap.fromTo(
        holdBarRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: HOLD_MS / 1000,
          ease: "none",
          onComplete: () => setHoldComplete(true),
        },
      );
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (holdComplete) return;
      setHolding(false);
      holdTween.current?.kill();
      gsap.to(holdBarRef.current, { scaleX: 0, duration: 0.15, ease: "none" });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      holdTween.current?.kill();
    };
  }, [holdComplete]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="sticky top-0 z-[1] flex h-screen flex-col overflow-hidden bg-black will-change-transform"
    >
      <div className="h-[11vh] min-h-16 shrink-0" />

      <div className="relative min-h-0 flex-1 overflow-hidden bg-card-well">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={SITE_BG_VIDEO}
          loop
          playsInline
          preload="auto"
          muted={muted}
          aria-label="Hero background video"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1.4px)",
            backgroundSize: "96px 96px",
            backgroundPosition: "48px 24px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Mute / unmute control */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={muted}
          className="absolute right-[clamp(24px,3vw,52px)] top-[clamp(20px,4vh,40px)] z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-colors duration-200 hover:bg-red hover:text-white pme-focus-ring"
        >
          <SpeakerIcon muted={muted} />
        </button>

        <p
          className="pointer-events-none absolute right-[clamp(24px,6vw,110px)] bottom-[clamp(28px,6vh,64px)] m-0 text-[15px] font-semibold tracking-[0.14em] text-white uppercase"
          aria-live="polite"
        >
          {holdComplete
            ? "Loading experience"
            : holding
              ? "Hold the spacebar to start"
              : "Hold the spacebar to start"}
        </p>

        <div className="pointer-events-none absolute right-[clamp(24px,12vw,200px)] bottom-[clamp(20px,4.4vh,46px)] left-[clamp(24px,12vw,200px)] h-px bg-white/18">
          <div
            ref={holdBarRef}
            className="h-full w-full origin-left scale-x-0 bg-white"
          />
        </div>
      </div>

      <div className="h-[9vh] min-h-12 shrink-0" />
    </section>
  );
}
