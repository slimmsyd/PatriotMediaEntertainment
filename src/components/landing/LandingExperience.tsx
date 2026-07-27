"use client";

import { useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LoadingOverlay } from "@/components/landing/LoadingOverlay";
import { Hero } from "@/components/landing/Hero";
import { EventsRail } from "@/components/landing/EventsRail";
import { AboutSection } from "@/components/landing/AboutSection";
import { CtaCard } from "@/components/landing/CtaCard";

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
          }}
          onGone={() => setShowLoader(false)}
        />
      )}
      <SiteNav variant="landing" />
      <main>
        <Hero startAt={heroStartAt} soundOn active={heroActive} />
        <EventsRail />
        <AboutSection />
        <div id="merch" className="scroll-mt-24" aria-hidden="true" />
        <CtaCard />
      </main>
      <SiteFooter />
    </div>
  );
}
