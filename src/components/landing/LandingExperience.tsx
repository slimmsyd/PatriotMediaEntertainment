"use client";

import { useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LoadingOverlay } from "@/components/landing/LoadingOverlay";
import { Hero } from "@/components/landing/Hero";
import { EventsRail } from "@/components/landing/EventsRail";
import { AboutSection } from "@/components/landing/AboutSection";
import { CtaCard } from "@/components/landing/CtaCard";
import { UpcomingEvents } from "@/components/landing/UpcomingEvents";
import { EVENT_1_VIDEO } from "@/lib/media";
import { prefetchVideo } from "@/lib/prefetchVideo";

export function LandingExperience() {
  const [heroStartAt, setHeroStartAt] = useState(0);
  const [heroActive, setHeroActive] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div className="relative w-full bg-black text-white">
      {showLoader && (
        <LoadingOverlay
          onComplete={(t) => {
            setHeroStartAt(t);
            setHeroActive(true);
            // Hero has the network; start warming event tile video for the rail below
            prefetchVideo(EVENT_1_VIDEO);
          }}
          onGone={() => setShowLoader(false)}
        />
      )}
      {/* Nav + menu chrome only after loader fully exits */}
      {!showLoader && <SiteNav variant="landing" />}
      <main>
        <Hero startAt={heroStartAt} soundOn active={heroActive} />
        <EventsRail />
        <AboutSection />
        <div id="merch" className="scroll-mt-24" aria-hidden="true" />
        <CtaCard />
        <UpcomingEvents />
      </main>
      <SiteFooter />
    </div>
  );
}
