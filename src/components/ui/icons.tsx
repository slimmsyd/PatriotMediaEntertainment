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

/** Solid glyph — readable on dark footer buttons. */
export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2z" />
      <path d="M17.35 6.05a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
      <path d="M12 2.5c-2.6 0-2.93.01-3.96.06-1.02.05-1.72.21-2.33.45a4.7 4.7 0 0 0-1.7 1.1 4.7 4.7 0 0 0-1.1 1.7c-.24.61-.4 1.31-.45 2.33C2.51 9.07 2.5 9.4 2.5 12s.01 2.93.06 3.96c.05 1.02.21 1.72.45 2.33a4.7 4.7 0 0 0 1.1 1.7 4.7 4.7 0 0 0 1.7 1.1c.61.24 1.31.4 2.33.45 1.03.05 1.36.06 3.96.06s2.93-.01 3.96-.06c1.02-.05 1.72-.21 2.33-.45a4.7 4.7 0 0 0 1.7-1.1 4.7 4.7 0 0 0 1.1-1.7c.24-.61.4-1.31.45-2.33.05-1.03.06-1.36.06-3.96s-.01-2.93-.06-3.96c-.05-1.02-.21-1.72-.45-2.33a4.7 4.7 0 0 0-1.1-1.7 4.7 4.7 0 0 0-1.7-1.1c-.61-.24-1.31-.4-2.33-.45C14.93 2.51 14.6 2.5 12 2.5zm0 1.7c2.55 0 2.85.01 3.86.06.93.04 1.44.2 1.78.33.45.17.77.38 1.11.72.34.34.55.66.72 1.11.13.34.29.85.33 1.78.05 1.01.06 1.31.06 3.86s-.01 2.85-.06 3.86c-.04.93-.2 1.44-.33 1.78-.17.45-.38.77-.72 1.11a3 3 0 0 1-1.11.72c-.34.13-.85.29-1.78.33-1.01.05-1.31.06-3.86.06s-2.85-.01-3.86-.06c-.93-.04-1.44-.2-1.78-.33a3 3 0 0 1-1.11-.72 3 3 0 0 1-.72-1.11c-.13-.34-.29-.85-.33-1.78C4.21 14.85 4.2 14.55 4.2 12s.01-2.85.06-3.86c.04-.93.2-1.44.33-1.78.17-.45.38-.77.72-1.11.34-.34.66-.55 1.11-.72.34-.13.85-.29 1.78-.33C9.15 4.21 9.45 4.2 12 4.2z" />
    </svg>
  );
}

/** Solid play-button mark — readable on dark footer buttons. */
export function YouTubeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M23.5 6.2a3.05 3.05 0 0 0-2.15-2.16C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.35.54A3.05 3.05 0 0 0 .5 6.2 32 32 0 0 0 0 12a32 32 0 0 0 .5 5.8 3.05 3.05 0 0 0 2.15 2.16C4.5 20.5 12 20.5 12 20.5s7.5 0 9.35-.54a3.05 3.05 0 0 0 2.15-2.16A32 32 0 0 0 24 12a32 32 0 0 0-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z" />
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
