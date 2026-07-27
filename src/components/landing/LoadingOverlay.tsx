"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/content";

gsap.registerPlugin(useGSAP);

const WORDMARK = site.wordmark;
const DURATION = 5;
const CHAR_MS = 85;
const START_DELAY = 0.5;

type LoadingOverlayProps = {
  onComplete?: () => void;
};

export function LoadingOverlay({ onComplete }: LoadingOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        setTyped(WORDMARK);
        if (barRef.current) gsap.set(barRef.current, { scaleX: 1 });
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.6,
          delay: 0.4,
          ease: "power1.inOut",
          onComplete: () => {
            setDone(true);
            setHidden(true);
            onComplete?.();
          },
        });
        return;
      }

      const progress = { p: 0 };
      const charState = { n: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(rootRef.current, {
            autoAlpha: 0,
            duration: 1.1,
            ease: "power1.inOut",
            onComplete: () => {
              setDone(true);
              setHidden(true);
              onComplete?.();
            },
          });
        },
      });

      tl.to(
        charState,
        {
          n: WORDMARK.length,
          duration: (WORDMARK.length * CHAR_MS) / 1000,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black px-10 pb-[120px] pt-24"
      aria-busy={!done}
      aria-live="polite"
    >
      <Image
        src="/images/loader-flag.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.22]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 52%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.82) 60%, #000000 100%)",
        }}
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
