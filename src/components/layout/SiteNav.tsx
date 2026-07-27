"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/content";
import { ChipButton } from "@/components/ui/ChipButton";
import { CloseIcon, EyeIcon, MenuIcon } from "@/components/ui/icons";

type SiteNavProps = {
  variant?: "landing" | "contact";
};

export function SiteNav({ variant = "landing" }: SiteNavProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(variant === "contact");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant === "contact") {
      setScrolledPastHero(true);
      setHidden(false);
      return;
    }

    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const vh = window.innerHeight;

        setScrolledPastHero(y > vh * 0.6);

        if (y < 40) {
          setHidden(false);
        } else if (delta > 6) {
          setHidden(true);
          setMenuOpen(false);
        } else if (delta < -6) {
          setHidden(false);
        }

        lastY = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant]);

  const solid = variant === "contact" || scrolledPastHero;

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 z-[45] flex h-[11vh] min-h-16 items-center justify-between px-[clamp(24px,4vw,72px)] text-white transition-[opacity,transform,background-color,border-color] duration-[420ms] ease-out"
        style={{
          opacity: hidden ? 0 : 1,
          transform: hidden
            ? "translateY(-104%) scale(0.94)"
            : "translateY(0) scale(1)",
          transitionDuration: "420ms, 520ms, 500ms, 500ms",
          transitionTimingFunction:
            "ease, cubic-bezier(0.22, 0.61, 0.36, 1), ease, ease",
          background: solid ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: solid ? "blur(14px)" : "none",
          WebkitBackdropFilter: solid ? "blur(14px)" : "none",
          borderBottom: solid
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid transparent",
          pointerEvents: hidden ? "none" : "auto",
        }}
      >
        <div className="flex items-center gap-3 text-[15px] font-medium tracking-[0.01em]">
          <EyeIcon />
          <span>{site.viewCount}</span>
        </div>

        <nav className="hidden items-center gap-[clamp(18px,2.4vw,40px)] text-[13px] font-semibold tracking-[0.16em] uppercase min-[901px]:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-red pme-focus-ring"
            >
              {link.label}
            </Link>
          ))}
          <ChipButton
            href="/contact"
            className="py-2.5 pr-2.5 pl-[22px] text-[13px] tracking-[0.16em] uppercase"
            chip="›"
          >
            Contact
          </ChipButton>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg min-[901px]:hidden pme-focus-ring cursor-pointer"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-near-black/96 pt-[calc(11vh+24px)] px-6 min-[901px]:hidden">
          <nav className="flex flex-col gap-6 text-[15px] font-semibold tracking-[0.16em] uppercase text-white">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-2 hover:text-red pme-focus-ring"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <ChipButton
              href="/contact"
              className="self-start py-3 pr-3 pl-7 text-[13px] tracking-[0.16em] uppercase"
              chip="›"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </ChipButton>
          </nav>
        </div>
      )}
    </>
  );
}
