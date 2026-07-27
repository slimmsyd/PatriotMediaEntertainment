"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { navLinks, site } from "@/lib/content";
import { ChipButton } from "@/components/ui/ChipButton";
import { CloseIcon } from "@/components/ui/icons";

type SiteNavProps = {
  variant?: "landing" | "contact";
};

export function SiteNav({ variant = "landing" }: SiteNavProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(
    variant === "contact",
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

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
        // Keep chrome visible while the menu is open
        if (menuOpen) {
          setHidden(false);
          lastY = window.scrollY;
          return;
        }

        const y = window.scrollY;
        const delta = y - lastY;
        const vh = window.innerHeight;

        setScrolledPastHero(y > vh * 0.6);

        if (y < 40) {
          setHidden(false);
        } else if (delta > 6) {
          setHidden(true);
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
  }, [variant, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen, closeMenu]);

  const solid = variant === "contact" || scrolledPastHero || menuOpen;

  return (
    <>
      {/* Top navigation bar */}
      <header
        className="fixed top-0 right-0 left-0 z-[50] flex h-[11vh] min-h-16 items-center justify-between px-[clamp(24px,4vw,72px)] text-white transition-[opacity,transform,background-color,border-color] duration-[420ms] ease-out"
        style={{
          opacity: hidden && !menuOpen ? 0 : 1,
          transform:
            hidden && !menuOpen
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
          pointerEvents: hidden && !menuOpen ? "none" : "auto",
        }}
      >
        <Link
          href="/#home"
          className="relative z-[51] max-w-[min(58vw,280px)] text-[12px] font-extrabold leading-tight tracking-[0.06em] uppercase text-white pme-focus-ring sm:max-w-none sm:text-[13px] sm:tracking-[0.1em]"
        >
          Patriot Media Entertainment
        </Link>

        <nav className="hidden items-center gap-[clamp(18px,2.4vw,40px)] text-[13px] font-semibold tracking-[0.16em] uppercase min-[901px]:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="pme-nav-link pme-focus-ring"
            >
              {link.label}
            </Link>
          ))}
          <ChipButton
            href="/contact"
            className="py-2.5 pr-2.5 pl-[22px] text-[13px] tracking-[0.16em] uppercase hover:bg-red"
            chip="›"
          >
            Contact
          </ChipButton>
        </nav>

        {/* Mobile header toggle — open AND close */}
        <button
          type="button"
          className="relative z-[51] inline-flex h-11 w-11 items-center justify-center rounded-lg min-[901px]:hidden pme-focus-ring cursor-pointer"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <CloseIcon className="h-5 w-5 text-white" />
          ) : (
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-[2px] w-[18px] rounded-full bg-white" />
              <span className="block h-[2px] w-[18px] rounded-full bg-white" />
            </span>
          )}
        </button>
      </header>

      {/* Fixed bottom Menu pill — always above the panel */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[52] flex justify-center pb-[max(20px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
          }}
          className="pointer-events-auto relative z-[52] inline-flex h-12 min-w-[148px] cursor-pointer items-center justify-between gap-6 rounded-full bg-white px-6 text-[16px] font-semibold tracking-[-0.01em] text-near-black shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition-[transform,color,background-color] duration-200 hover:scale-[1.02] hover:bg-red hover:text-white active:scale-[0.98] pme-focus-ring"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          {menuOpen ? (
            <CloseIcon className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-[2px] w-[18px] rounded-full bg-current" />
              <span className="block h-[2px] w-[18px] rounded-full bg-current" />
            </span>
          )}
        </button>
      </div>

      {/* Full-screen menu panel — below toggles so re-click closes */}
      <div
        id="site-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[48] flex flex-col bg-near-black/96 text-white backdrop-blur-md transition-[opacity,visibility] duration-300 ease-out ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      >
        <div
          className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-2 px-8 pt-24 pb-28"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-2 py-3 text-[clamp(22px,4vw,32px)] font-medium tracking-[-0.02em] pme-link-red pme-focus-ring"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <ChipButton
              href="/contact"
              className="py-3.5 pr-3.5 pl-7 text-[14px] tracking-[0.14em] uppercase"
              chip="›"
              onClick={closeMenu}
            >
              Contact
            </ChipButton>
          </div>
        </div>
      </div>
    </>
  );
}
