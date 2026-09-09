"use client";

import { useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LoadingOverlay } from "@/components/landing/LoadingOverlay";
import { Hero } from "@/components/landing/Hero";
import { EventsRail } from "@/components/landing/EventsRail";
import { WhatWeAreSection } from "@/components/landing/WhatWeAreSection";
import { WhoWeServeSection } from "@/components/landing/WhoWeServeSection";
import { DonateBand } from "@/components/landing/DonateBand";
import { AboutSection } from "@/components/landing/AboutSection";
import { CtaCard } from "@/components/landing/CtaCard";
import { UpcomingEvents } from "@/components/landing/UpcomingEvents";
import { prefetchVideo } from "@/lib/prefetchVideo";
import type { SiteContent } from "@/lib/cms/queries";

type LandingExperienceProps = {
  /** Copy and events loaded from the database by the page above. */
  content: SiteContent;
};

export function LandingExperience({ content }: LandingExperienceProps) {
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
            // Hero has the network; start warming the videos the rail will
            // actually render, whatever the client has published.
            for (const event of content.pastEvents) {
              if ("video" in event && event.video) {
                prefetchVideo(event.video);
              }
            }
          }}
          onGone={() => setShowLoader(false)}
        />
      )}
      {/* Nav + menu chrome only after loader fully exits */}
      {!showLoader && (
        <SiteNav
          variant="landing"
          site={content.site}
          donate={content.donate}
        />
      )}
      <main>
        <Hero startAt={heroStartAt} soundOn active={heroActive} />
        <EventsRail events={content.pastEvents} />
        <WhatWeAreSection copy={content.whatWeAre} />
        <WhoWeServeSection copy={content.whoWeServe} />
        <DonateBand copy={content.donate} />
        <AboutSection copy={content.about} />
        <CtaCard copy={content.cta} />
        <UpcomingEvents
          events={content.upcomingEvents}
          copy={content.upcomingCopy}
        />
      </main>
      <SiteFooter site={content.site} />
    </div>
  );
}
