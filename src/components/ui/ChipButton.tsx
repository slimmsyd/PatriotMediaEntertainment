import Link from "next/link";
import type { ReactNode } from "react";

type ChipButtonProps = {
  href?: string;
  children: ReactNode;
  chip?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Fill colour. `red` is reserved for the donate CTA. */
  tone?: "navy" | "red";
  className?: string;
  hoverClassName?: string;
  chipClassName?: string;
  /** Announced instead of the visible label — used for off-site links. */
  ariaLabel?: string;
};

const base =
  "inline-flex items-center gap-3.5 rounded-xl text-white font-semibold cursor-pointer transition-colors duration-200 pme-focus-ring hover:text-white";

/** Red hovers darker, not red-on-red — see --red-dark in globals.css. */
const tones = {
  navy: "bg-navy hover:bg-red",
  red: "bg-red hover:bg-red-dark",
} as const;

export function ChipButton({
  href,
  children,
  chip,
  onClick,
  type = "button",
  tone = "navy",
  className = "",
  chipClassName = "bg-white/22 text-white",
  ariaLabel,
}: ChipButtonProps) {
  const classes = `${base} ${tones[tone]} ${className}`;

  const content = (
    <>
      <span className="text-white">{children}</span>
      {chip != null && (
        <span
          className={`inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[13px] tracking-normal text-white ${chipClassName}`}
        >
          {chip}
        </span>
      )}
    </>
  );

  if (href) {
    // Off-site targets (PayPal) leave the app, so they skip the router.
    if (/^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          aria-label={ariaLabel}
          className={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </button>
  );
}
