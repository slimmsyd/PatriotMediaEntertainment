"use client";

import { useEffect, useRef, useState } from "react";

type InViewVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  "aria-label"?: string;
  /**
   * How early to start fetching relative to the viewport.
   * Default loads well before the tile scrolls in.
   */
  loadRootMargin?: string;
  /** Fraction of the element that must be visible before play. */
  playThreshold?: number;
};

/**
 * Muted looping video that:
 * 1. Starts network load early (large rootMargin)
 * 2. Plays when sufficiently on-screen
 * 3. Pauses when off-screen (saves CPU / decoder for other clips)
 */
export function InViewVideo({
  src,
  poster,
  className = "",
  "aria-label": ariaLabel,
  loadRootMargin = "120% 0px 120% 0px",
  playThreshold = 0.2,
}: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let loadObs: IntersectionObserver | null = null;
    let playObs: IntersectionObserver | null = null;
    let cancelled = false;

    const onCanPlay = () => {
      if (!cancelled) setReady(true);
    };
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onCanPlay);

    const startLoad = () => {
      if (video.preload !== "auto") {
        video.preload = "auto";
        // Re-assign src to ensure browsers that ignored preload="none" begin fetch
        if (video.getAttribute("src") !== src) {
          video.src = src;
        }
        void video.load();
      }
    };

    const tryPlay = async () => {
      if (video.readyState < 2) startLoad();
      try {
        await video.play();
      } catch {
        // Autoplay can fail until a gesture; keep muted + try again on next intersect
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      startLoad();
      void tryPlay();
      return () => {
        cancelled = true;
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", onCanPlay);
      };
    }

    loadObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        startLoad();
        loadObs?.disconnect();
        loadObs = null;
      },
      { root: null, rootMargin: loadRootMargin, threshold: 0 },
    );
    loadObs.observe(video);

    playObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= playThreshold) {
          void tryPlay();
        } else {
          video.pause();
        }
      },
      { root: null, rootMargin: "0px", threshold: [0, playThreshold, 0.5, 1] },
    );
    playObs.observe(video);

    return () => {
      cancelled = true;
      loadObs?.disconnect();
      playObs?.disconnect();
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
      video.pause();
    };
  }, [src, loadRootMargin, playThreshold]);

  return (
    <video
      ref={videoRef}
      className={`${className} ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={ariaLabel}
    />
  );
}
