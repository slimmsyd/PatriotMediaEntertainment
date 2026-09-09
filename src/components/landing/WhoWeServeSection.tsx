"use client";

import Link from "next/link";
import { whoWeServeCopy, serviceTypes } from "@/lib/content-defaults";

export function WhoWeServeSection() {
  return (
    <section
      id="who-we-serve"
      className="relative z-[4] bg-off-white text-near-black pt-[clamp(64px,7.4vw,88px)] pr-[clamp(28px,6vw,88px)] pb-[clamp(72px,8vw,96px)] pl-[clamp(28px,6vw,88px)]"
      aria-label="Who we serve"
    >
      <div className="grid items-start gap-[clamp(40px,5.4vw,64px)] [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]">
        <div className="flex flex-col gap-[22px]">
          <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-navy">
            {whoWeServeCopy.eyebrow}
          </span>
          <h2 className="m-0 text-[clamp(38px,4.2vw,58px)] font-semibold leading-[0.98] tracking-[-0.03em] text-pretty">
            {whoWeServeCopy.title}
          </h2>
          <p className="m-0 max-w-[36ch] text-[clamp(17px,1.3vw,19px)] leading-[1.6] text-[#3C3C40] text-pretty">
            {whoWeServeCopy.body}
          </p>
          <Link
            href={whoWeServeCopy.ctaHref}
            className="mt-2.5 self-start rounded-lg bg-navy px-[26px] py-[15px] text-[14px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 hover:bg-red pme-focus-ring"
          >
            <span className="text-white">{whoWeServeCopy.cta}</span>
          </Link>
        </div>

        <div className="flex flex-col">
          {serviceTypes.map((type, i) => (
            <Link
              key={type.id}
              href="/contact"
              className={`grid grid-cols-[68px_1fr_auto] items-center gap-6 border-t border-near-black/14 px-1.5 py-[26px] transition-colors duration-200 hover:bg-white pme-focus-ring ${
                i === serviceTypes.length - 1 ? "border-b" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="text-[14px] font-bold tracking-[0.1em] text-[#9A9A96]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[clamp(26px,2.5vw,34px)] font-semibold tracking-[-0.025em]">
                {type.label}
              </span>
              <span className="max-[520px]:hidden text-right text-[15px] font-semibold text-[#55555A]">
                {type.qualifier}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
