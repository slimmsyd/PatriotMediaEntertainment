import Link from "next/link";
import type { ReactNode } from "react";

type ChipButtonProps = {
  href?: string;
  children: ReactNode;
  chip?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  hoverClassName?: string;
  chipClassName?: string;
};

const base =
  "inline-flex items-center gap-3.5 rounded-xl bg-navy text-white font-semibold cursor-pointer transition-colors duration-200 pme-focus-ring hover:bg-navy-dark";

export function ChipButton({
  href,
  children,
  chip,
  onClick,
  type = "button",
  className = "",
  chipClassName = "bg-white/22",
}: ChipButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      {chip != null && (
        <span
          className={`inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-[13px] tracking-normal ${chipClassName}`}
        >
          {chip}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={`${base} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${className}`}>
      {content}
    </button>
  );
}
