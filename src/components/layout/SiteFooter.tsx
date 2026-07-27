import Link from "next/link";
import { footerColumns, site } from "@/lib/content";
import { InstagramIcon, YouTubeIcon } from "@/components/ui/icons";

export function SiteFooter() {
  return (
    <footer className="relative z-[4] bg-off-white text-near-black px-[clamp(24px,4vw,72px)] pt-[clamp(48px,8vh,96px)] pb-[clamp(90px,12vh,120px)]">
      <div className="grid gap-[clamp(32px,4vw,72px)] min-[900px]:grid-cols-[minmax(300px,1.35fr)_repeat(3,minmax(150px,0.75fr))]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[clamp(30px,3vw,46px)] font-extrabold tracking-[-0.02em] leading-none text-navy">
              PATRIOT
            </span>
            <span className="text-[clamp(13px,1vw,16px)] font-bold tracking-[0.34em] uppercase text-near-black">
              Media Entertainment
            </span>
            <span className="mt-3 flex h-[3px] w-24" aria-hidden="true">
              <span className="flex-1 bg-navy" />
              <span className="flex-1 bg-red" />
            </span>
          </div>

          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            <div>
              <h3 className="mb-2 text-[19px] font-bold">Head Office</h3>
              <p className="m-0 text-base leading-[1.6] text-muted">
                {site.addressLines[0]}
                <br />
                {site.addressLines[1]}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-[19px] font-bold">Bookings</h3>
              <p className="m-0 text-base leading-[1.6] text-muted">
                {site.bookingsEmail}
                <br />
                {site.phone}
              </p>
            </div>
          </div>
        </div>

        <FooterCol title="Shows" links={footerColumns.shows} />
        <FooterCol title="Company" links={footerColumns.company} />

        <div className="flex flex-col gap-[18px]">
          <h3 className="text-[19px] font-bold">Connect</h3>
          {footerColumns.connect.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-base text-near-black transition-colors duration-200 hover:text-red pme-focus-ring"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-1 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-[10px] bg-near-black text-white transition-colors duration-200 hover:bg-navy pme-focus-ring"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-[10px] bg-near-black text-white transition-colors duration-200 hover:bg-red pme-focus-ring"
            >
              <YouTubeIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(48px,7vh,88px)] flex flex-wrap items-center justify-between gap-4 border-t border-near-black/14 pt-[26px]">
        <p className="m-0 text-[15px] text-muted">
          © 2026 {site.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="#"
            className="text-[15px] font-semibold text-near-black transition-colors duration-200 hover:text-red pme-focus-ring"
          >
            Legal Notice
          </Link>
          <Link
            href="#"
            className="text-[15px] font-semibold text-near-black transition-colors duration-200 hover:text-red pme-focus-ring"
          >
            Privacy
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2.5 rounded-[10px] border border-near-black/16 bg-transparent px-[18px] py-3 text-[15px] font-semibold text-near-black transition-colors duration-200 hover:border-navy hover:text-navy cursor-pointer pme-focus-ring"
          >
            <span
              className="inline-flex h-[15px] w-[22px] overflow-hidden rounded-[2px] border border-near-black/12"
              aria-hidden="true"
            >
              <span className="flex-1 bg-red" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-navy" />
            </span>
            United States
            <span aria-hidden="true">⌃</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-[18px]">
      <h3 className="text-[19px] font-bold">{title}</h3>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-base text-muted transition-colors duration-200 hover:text-red pme-focus-ring"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
