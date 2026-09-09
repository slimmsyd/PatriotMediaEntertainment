"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  navLinks,
  donate as defaultDonate,
  site as defaultSite,
} from "@/lib/content-defaults";
import type { DonateCopyValue, SiteCopyValue } from "@/lib/cms/schemas";
import { ChipButton } from "@/components/ui/ChipButton";
import { DonateButton } from "@/components/donate/DonateButton";
import { CloseIcon } from "@/components/ui/icons";

gsap.registerPlugin(useGSAP);

type SiteNavProps = {
  variant?: "landing" | "contact";
  site?: SiteCopyValue;
  donate?: DonateCopyValue;
};

/** How far into the page (vh) counts as “still watching the hero”. */
const HERO_CINEMA_END = 0.42;

export function SiteNav({
  variant = "landing",
  site = defaultSite,
  donate = defaultDonate,
}: SiteNavProps) {
  const headerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const cinemaTween = useRef<gsap.core.Timeline | null>(null);

  const [hidden, setHidden] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(
    variant === "contact",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHover, setNavHover] = useState(false);
  /** Compact movie-mode while user is on the hero video. */
  const [cinematic, setCinematic] = useState(variant === "landing");
  /** Brief beat at full size after mount, then settle into cinema mode. */
  const [cinemaArmed, setCinemaArmed] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  useEffect(() => {
    if (variant !== "landing") return;
    const t = window.setTimeout(() => setCinemaArmed(true), 700);
    return () => window.clearTimeout(t);
  }, [variant]);

  /** Cinematic shrink when watching hero; expand when interacting or leaving hero. */
  const wantCinema =
    variant === "landing" &&
    cinemaArmed &&
    cinematic &&
    !menuOpen &&
    !navHover &&
    !hidden;

  useGSAP(
    () => {
      const header = headerRef.current;
      const pill = pillRef.current;
      if (!header) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      cinemaTween.current?.kill();

      if (reduce) {
        gsap.set(header, { clearProps: "transform,opacity" });
        if (pill) gsap.set(pill, { clearProps: "transform,opacity" });
        return;
      }

      // Cinema: nav recedes (smaller, not gone) — letterbox / theater UI feel
      if (wantCinema) {
        cinemaTween.current = gsap.timeline({ defaults: { overwrite: "auto" } });
        cinemaTween.current
          .to(
            header,
            {
              scale: 0.86,
              y: -10,
              opacity: 0.78,
              duration: 1.15,
              ease: "power3.inOut",
              transformOrigin: "50% 0%",
            },
            0,
          )
          .to(
            pill,
            {
              scale: 0.88,
              y: 14,
              opacity: 0.72,
              duration: 1.15,
              ease: "power3.inOut",
              transformOrigin: "50% 100%",
            },
            0,
          );
      } else {
        cinemaTween.current = gsap.timeline({ defaults: { overwrite: "auto" } });
        cinemaTween.current
          .to(
            header,
            {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
              transformOrigin: "50% 0%",
            },
            0,
          )
          .to(
            pill,
            {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
              transformOrigin: "50% 100%",
            },
            0,
          );
      }
    },
    { dependencies: [wantCinema], scope: headerRef },
  );

  useEffect(() => {
    if (variant === "contact") {
      setScrolledPastHero(true);
      setHidden(false);
      setCinematic(false);
      return;
    }

    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (menuOpen) {
          setHidden(false);
          setCinematic(false);
          lastY = window.scrollY;
          return;
        }

        const y = window.scrollY;
        const delta = y - lastY;
        const vh = window.innerHeight;

        setScrolledPastHero(y > vh * 0.6);
        // Still “watching” the hero when near the top
        setCinematic(y < vh * HERO_CINEMA_END);

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
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-[50] flex h-[11vh] min-h-16 items-center justify-between gap-3 px-[clamp(24px,4vw,72px)] text-white will-change-transform"
        style={{
          // Hide-on-scroll (separate from cinematic GSAP scale)
          opacity: hidden && !menuOpen ? 0 : undefined,
          visibility: hidden && !menuOpen ? "hidden" : "visible",
          pointerEvents: hidden && !menuOpen ? "none" : "auto",
          transition: hidden
            ? "opacity 420ms ease, visibility 420ms ease"
            : "background-color 500ms ease, border-color 500ms ease, backdrop-filter 500ms ease",
          background: solid ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: solid ? "blur(14px)" : "none",
          WebkitBackdropFilter: solid ? "blur(14px)" : "none",
          borderBottom: solid
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid transparent",
        }}
        onMouseEnter={() => setNavHover(true)}
        onMouseLeave={() => setNavHover(false)}
        onFocusCapture={() => setNavHover(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setNavHover(false);
          }
        }}
      >
        <Link
          href="/#home"
          className="relative z-[51] max-w-[min(44vw,280px)] text-[12px] font-extrabold leading-tight tracking-[0.06em] uppercase text-white pme-focus-ring sm:max-w-none sm:text-[13px] sm:tracking-[0.1em]"
        >
          {site.wordmark}
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
          <DonateButton copy={donate} className="h-[50px] px-[26px] text-[13px] tracking-[0.16em] uppercase" />
          <ChipButton
            href="/contact"
            className="py-2.5 pr-2.5 pl-[22px] text-[13px] tracking-[0.16em] uppercase"
            chip="›"
          >
            Contact
          </ChipButton>
        </nav>

        {/* Mobile: Donate stays on the bar — burying a donate CTA in a menu kills it */}
        <div className="relative z-[51] flex items-center gap-2 min-[901px]:hidden">
          {!menuOpen && (
            <DonateButton copy={donate} className="h-11 px-4 text-[12px] tracking-[0.14em] uppercase" />
          )}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg pme-focus-ring cursor-pointer"
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
        </div>
      </header>

      {/* Fixed bottom Menu pill — always above the panel */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[52] flex justify-center pb-[max(20px,env(safe-area-inset-bottom))]">
        <button
          ref={pillRef}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
          }}
          onMouseEnter={() => setNavHover(true)}
          onMouseLeave={() => setNavHover(false)}
          onFocus={() => setNavHover(true)}
          onBlur={() => setNavHover(false)}
          className="pointer-events-auto relative z-[52] inline-flex h-12 min-w-[148px] cursor-pointer items-center justify-between gap-6 rounded-full bg-white px-6 text-[16px] font-semibold tracking-[-0.01em] text-near-black shadow-[0_8px_28px_rgba(0,0,0,0.28)] will-change-transform transition-colors duration-200 hover:bg-red hover:text-white pme-focus-ring"
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

          <div className="mt-8 flex flex-wrap gap-3">
            <DonateButton
              copy={donate}
              className="h-[58px] px-7 text-[14px] tracking-[0.14em] uppercase"
              onClick={closeMenu}
            />
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
