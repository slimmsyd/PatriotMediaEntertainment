import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 14" width="24" height="14" aria-hidden="true" {...props}>
      <path
        d="M1 7 C6 1, 18 1, 23 7 C18 13, 6 13, 1 7 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="7" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function StepLineIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 34 12" width="34" height="12" aria-hidden="true" {...props}>
      <path
        d="M1 11 L11 11 C15 11, 15 1, 19 1 L33 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 25 24" width="19" height="19" fill="none" aria-hidden="true" {...props}>
      <path d="M10.5 16L14.5 12L10.5 8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SpeakerIcon({ muted = false, ...props }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 26 20" width="26" height="20" aria-hidden="true" {...props}>
      <path d="M2 7.2h3.6L11 3v14l-5.4-4.2H2z" fill="currentColor" />
      {muted ? (
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
          <line x1="16" y1="6.5" x2="23" y2="13.5" />
          <line x1="23" y1="6.5" x2="16" y2="13.5" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
          <path d="M15.4 6.6c1.7 1.9 1.7 4.9 0 6.8" />
          <path d="M19 4.2c3 3.2 3 8.4 0 11.6" />
        </g>
      )}
    </svg>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 6.5L12 13l8.5-6.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21c4.5-5.2 6.6-8.3 6.6-11A6.6 6.6 0 105.4 10c0 2.7 2.1 5.8 6.6 11z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PaperPlaneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 20.5L21.5 12L3 3.5l3.4 7.3L15 12l-8.6 1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.5 8.2a3 3 0 00-2.1-2.1C17.6 5.5 12 5.5 12 5.5s-5.6 0-7.4.6A3 3 0 002.5 8.2 31.4 31.4 0 002 12a31.4 31.4 0 00.5 3.8 3 3 0 002.1 2.1c1.8.6 7.4.6 7.4.6s5.6 0 7.4-.6a3 3 0 002.1-2.1A31.4 31.4 0 0022 12a31.4 31.4 0 00-.5-3.8z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13 5L7 11C7 11 5.5621 9.5621 4 8"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
