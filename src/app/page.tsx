import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LoadingOverlay } from "@/components/landing/LoadingOverlay";
import { Hero } from "@/components/landing/Hero";
import { EventsRail } from "@/components/landing/EventsRail";
import { AboutSection } from "@/components/landing/AboutSection";
import { CtaCard } from "@/components/landing/CtaCard";

export default function HomePage() {
  return (
    <div className="relative w-full bg-black text-white">
      <LoadingOverlay />
      <SiteNav variant="landing" />
      <main>
        <Hero />
        <EventsRail />
        <AboutSection />
        <div id="merch" className="scroll-mt-24" aria-hidden="true" />
        <CtaCard />
      </main>
      <SiteFooter />
    </div>
  );
}
