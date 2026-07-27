import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactRail } from "@/components/contact/ContactRail";
import { StepEyebrow } from "@/components/ui/StepEyebrow";
import { TricolorBar } from "@/components/ui/TricolorBar";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Patriot Media Entertainment team.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-off-white text-near-black">
      <TricolorBar className="fixed top-0 right-0 left-0 z-30" />
      <SiteNav variant="contact" />

      <main className="px-[clamp(24px,5vw,96px)] pt-[calc(11vh+clamp(48px,8vh,104px))] pb-[clamp(72px,12vh,150px)]">
        <StepEyebrow label="Contact" size="sm" className="mb-[clamp(20px,3vh,32px)]" />
        <h1 className="m-0 mb-[clamp(40px,6vh,72px)] max-w-[22ch] text-[clamp(38px,5vw,84px)] font-medium leading-[1.02] tracking-[-0.03em] text-pretty">
          Talk to our team from today
        </h1>

        <div className="grid gap-[clamp(40px,7vw,128px)] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(320px,1.05fr)_minmax(300px,0.8fr)]">
          <ContactForm />
          <ContactRail />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
