"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/content";
import { LOADER_BG_VIDEO, SITE_BG_VIDEO } from "@/lib/media";

gsap.registerPlugin(useGSAP);

const WORDMARK = site.wordmark;
const DURATION = 1.5;
const START_DELAY = 0.2;
const TYPE_DURATION = Math.max(0.4, DURATION - START_DELAY);

type LoadingOverlayProps = {
  /** Called with hero video time so playback continues into the hero. */
  onComplete?: (currentTime: number) => void;
  /** Called after the overlay has fully faded out. */
  onGone?: () => void;
};

export function LoadingOverlay({ onComplete, onGone }: LoadingOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const loaderVideoRef = useRef<HTMLVideoElement>(null);
  /** Hidden hero track — audio starts under the loader visual. */
  const audioVideoRef = useRef<HTMLVideoElement>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Loader visual loops muted; hero audio starts immediately
  useEffect(() => {
    const visual = loaderVideoRef.current;
    if (visual) {
      visual.muted = true;
      void visual.play().catch(() => undefined);
    }

    const audio = audioVideoRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.defaultMuted = false;
    audio.volume = 1;

    let unlock: (() => void) | undefined;

    const tryPlay = async () => {
      try {
        audio.muted = false;
        await audio.play();
      } catch {
        unlock = () => {
          window.removeEventListener("pointerdown", unlock!);
          window.removeEventListener("keydown", unlock!);
          // Loader may have already finished and unmounted by the time the
          // user's first gesture arrives — don't resurrect playback on a
          // detached clone the Hero controls have no way to reach.
          if (!audio.isConnected) return;
          audio.muted = false;
          audio.volume = 1;
          void audio.play().catch(() => undefined);
        };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
      }
    };

    void tryPlay();

    return () => {
      if (!unlock) return;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useGSAP(
    () => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        const t = audioVideoRef.current?.currentTime ?? 0;
        if (audioVideoRef.current) {
          audioVideoRef.current.muted = true;
          audioVideoRef.current.pause();
        }
        if (loaderVideoRef.current) {
          loaderVideoRef.current.pause();
        }
        onComplete?.(t);
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: reduce ? 0.6 : 1.1,
          delay: reduce ? 0.4 : 0,
          ease: "power1.inOut",
          onComplete: () => {
            setDone(true);
            setHidden(true);
            onGone?.();
          },
        });
      };

      if (reduce) {
        setTyped(WORDMARK);
        if (barRef.current) gsap.set(barRef.current, { scaleX: 1 });
        finish();
        return;
      }

      const progress = { p: 0 };
      const charState = { n: 0 };

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(
        charState,
        {
          n: WORDMARK.length,
          duration: TYPE_DURATION,
          delay: START_DELAY,
          ease: "none",
          onUpdate: () => setTyped(WORDMARK.slice(0, Math.floor(charState.n))),
        },
        0,
      );

      tl.to(
        progress,
        {
          p: 1,
          duration: DURATION,
          ease: "none",
          onUpdate: () => {
            const eased = 1 - Math.pow(1 - progress.p, 1.8);
            if (barRef.current) {
              gsap.set(barRef.current, { scaleX: eased });
            }
          },
        },
        0,
      );
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (hidden) {
      document.body.style.overflow = "";
    } else if (!done) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [done, hidden]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-10 pb-[120px] pt-24"
      aria-busy={!done}
      aria-live="polite"
    >
      {/* LOOPVIDEOBG — loading visual differentiator */}
      <video
        ref={loaderVideoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.45]"
        src={LOADER_BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 52%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Hero audio starts under the loader (not shown) */}
      <video
        ref={audioVideoRef}
        className="pointer-events-none absolute h-px w-px opacity-0"
        src={SITE_BG_VIDEO}
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={false}
        aria-hidden="true"
        tabIndex={-1}
      />

      <p className="relative m-0 max-w-[1100px] text-center text-[19px] font-bold leading-[1.5] tracking-[0.16em] text-white uppercase text-pretty">
        {typed}
        <span
          className="pme-caret ml-[0.14em] inline-block h-[1em] w-[0.62em] align-[-0.14em] bg-white"
          aria-hidden="true"
        />
      </p>
      <div className="absolute right-0 bottom-[6.4%] left-0 h-px bg-white/13">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-white"
        />
      </div>
    </div>
  );
}
