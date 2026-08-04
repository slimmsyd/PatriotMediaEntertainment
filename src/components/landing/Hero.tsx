"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SITE_BG_VIDEO } from "@/lib/media";
import { PlayPauseIcon, SpeakerIcon } from "@/components/ui/icons";

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
  const holdTween = useRef<gsap.core.Tween | null>(null);
  /** True after user has intentionally paused (or autoplay blocked). */
  const userPausedRef = useRef(false);
  const startAtAppliedRef = useRef(false);

  const [holding, setHolding] = useState(false);
  const [muted, setMuted] = useState(!soundOn);
  const [playing, setPlaying] = useState(false);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !active) return;
    userPausedRef.current = false;
    video.muted = muted;
    video.defaultMuted = muted;
    video.volume = 1;
    try {
      await video.play();
      setPlaying(true);
    } catch (err) {
      setPlaying(false);
      userPausedRef.current = true;
      throw err;
    }
  }, [active, muted]);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = true;
    video.pause();
    setPlaying(false);
    holdTween.current?.kill();
    setHolding(false);
    gsap.set(holdBarRef.current, { scaleX: 0 });
  }, []);

  const togglePlayPause = () => {
    if (playing) {
      pauseVideo();
    } else {
      void playVideo();
    }
  };

  // Sync muted prop to element without forcing play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.defaultMuted = muted;
  }, [muted]);

  // Active / startAt: autoplay when hero becomes active (unless user paused)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      setPlaying(false);
      return;
    }

    if (!startAtAppliedRef.current && startAt > 0 && Number.isFinite(startAt)) {
      video.currentTime = startAt;
      startAtAppliedRef.current = true;
    }

    if (userPausedRef.current) return;

    void playVideo().catch(() => {
      const unlock = () => {
        void playVideo();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
    });
    // Intentionally omit muted — mute is synced separately so toggle doesn't restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play only on active/startAt
  }, [startAt, active]);

  // Keep `playing` in sync with the element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      userPausedRef.current = false;
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

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

  // Hold spacebar to start — only when paused
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();

      // Already playing — space does nothing (use pause button)
      if (playing) return;

      setHolding(true);
      holdTween.current?.kill();
      holdTween.current = gsap.fromTo(
        holdBarRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: HOLD_MS / 1000,
          ease: "none",
          onComplete: () => {
            setHolding(false);
            gsap.set(holdBarRef.current, { scaleX: 0 });
            void playVideo();
          },
        },
      );
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (playing) return;
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
  }, [playing, playVideo]);

  const statusText = playing
    ? "Current playing"
    : holding
      ? "Hold the spacebar to start"
      : "Hold the spacebar to start";

  return (
    // Bounds how long the sticky hero can stay pinned — its containing block,
    // not its own height, decides that. Without this wrapper `sticky` reads
    // its height from <main> (which spans the whole page) and never releases,
    // so the video keeps painting over every section below it while scrolling.
    <div className="relative h-[185vh]">
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

          {/* Play / pause + mute controls */}
          <div className="absolute right-[clamp(24px,3vw,52px)] top-[clamp(20px,4vh,40px)] z-10 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={playing ? "Pause video" : "Play video"}
              aria-pressed={!playing}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-colors duration-200 hover:bg-red hover:text-white pme-focus-ring"
            >
              <PlayPauseIcon playing={playing} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={muted}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-colors duration-200 hover:bg-red hover:text-white pme-focus-ring"
            >
              <SpeakerIcon muted={muted} />
            </button>
          </div>

          <p
            className="pointer-events-none absolute right-[clamp(24px,6vw,110px)] bottom-[clamp(28px,6vh,64px)] m-0 text-[15px] font-semibold tracking-[0.14em] text-white uppercase"
            aria-live="polite"
          >
            {statusText}
          </p>

          <div
            className="pointer-events-none absolute right-[clamp(24px,12vw,200px)] bottom-[clamp(20px,4.4vh,46px)] left-[clamp(24px,12vw,200px)] h-px bg-white/18"
            aria-hidden={playing}
          >
            <div
              ref={holdBarRef}
              className="h-full w-full origin-left scale-x-0 bg-white"
            />
          </div>
        </div>

        <div className="h-[9vh] min-h-12 shrink-0" />
      </section>
    </div>
  );
}
