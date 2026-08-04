import { EVENT_1_POSTER, EVENT_1_VIDEO } from "@/lib/media";

export const site = {
  name: "Patriot Entertainment & Media Group",
  wordmark: "PATRIOT ENTERTAINMENT & MEDIA GROUP",
  // TODO(client): no new email provided with the rebrand copy — placeholders retained.
  email: "hello@patriotmedia.com",
  bookingsEmail: "bookings@patriotmedia.com",
  phone: "540-990-7868",
  addressLines: [
    "General Washington Executive Center",
    "2217 Princess Anne Street, Suite #401",
    "Fredericksburg, VA 22401",
  ],
  bookingsHours: "Mon–Fri, 9am–6pm ET",
};

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Upcoming Events", href: "/#upcoming" },
  { label: "Merch", href: "/#merch" },
] as const;

/** Shared showcase media until unique event films are provided. */
const EVENT_PLACEHOLDER_VIDEO = "/videos/event-1.mp4";
const EVENT_PLACEHOLDER_POSTER = "/images/event-1-poster.jpg";

export const events = [
  {
    id: "event-1",
    title: "Heal the World",
    eyebrow: "Pop",
    placeholder: "Drop event 1 film / photo",
    video: EVENT_1_VIDEO,
    poster: EVENT_1_POSTER,
  },
] as const;

export const aboutCopy = {
  eyebrow: "Who we are",
  title: "Born from a life in show business",
  lead: "Patriot Entertainment & Media Group was born through the eyes of Reggie Randall-Sans, son of music icon Ida Sans, known for the hit records \"Sad Christmas\" and \"Darling, I Understand.\"",
  detail: [
    "As the son of one of music's biggest entertainers, Reggie was blessed to exemplify what show business is truly about, working alongside Rick James, The Ohio Players, Clarence Carter, and other legends of the industry.",
    "Our vision is to create unforgettable live entertainment experiences, giving others the chance to feel the same excitement, inspiration, and joy Reggie has experienced throughout his years.",
  ],
  cta: "Build with us",
  ctaHref: "/contact",
  /** Cleaned founder / leadership photo — single image on the right of Who We Are. */
  founderImage: "/images/about-founder.jpg",
  founderImageAlt:
    "Reggie Randall-Sans, founder of Patriot Entertainment & Media Group",
  founderName: "Reggie Randall-Sans",
  founderRole: "Founder",
} as const;

/**
 * "About" panel — full-bleed dark statement panel: company overview + the
 * geography it covers. Sits above Who We Serve / Who We Are, owns id="about".
 */
export const whatWeAreCopy = {
  headline: "Entertainment built for here and beyond",
  body: "Patriot Entertainment & Media Group is an entertainment and media company with a focus on local entertainment in the DMV area (Washington D.C., Maryland, and Virginia) while building experiences that reach a national audience.",
  marketMarkers: [
    { label: "Washington D.C." },
    { label: "Maryland" },
    { label: "Virginia" },
    { label: "National", emphasis: true },
  ],
} as const;

/** "Who They Serve" — audience + the event types the company books for. */
export const whoWeServeCopy = {
  eyebrow: "Who we serve",
  title: "Serving those who serve us",
  body: "We're dedicated to serving military families and communities, bringing unforgettable live entertainment to the moments that matter most.",
  cta: "Book an event",
  ctaHref: "/contact",
} as const;

export const serviceTypes = [
  { id: "weddings", label: "Weddings", qualifier: "Ceremony & reception" },
  { id: "birthday-parties", label: "Birthday Parties", qualifier: "All ages" },
  {
    id: "community-events",
    label: "Community Events",
    qualifier: "Base & city-wide",
  },
  {
    id: "corporate-events",
    label: "Corporate Events",
    qualifier: "Brand & agency",
  },
  {
    id: "bar-mitzvahs",
    label: "Bar Mitzvahs",
    qualifier: "Family celebrations",
  },
  {
    id: "management-consulting",
    label: "Management & Consulting",
    qualifier: "Strategy & operations",
  },
] as const;

export const ctaCopy = {
  titleLines: ["Unlock the right stage", "with our team"],
  button: "Contact us",
};

/**
 * U.S. military branch seals — horizontal stack on the CTA card.
 * Assets: U.S. government works (public domain) via Wikimedia Commons.
 */
export const partnerLogos = [
  {
    id: "army",
    name: "United States Army",
    src: "/images/partners/army.png",
  },
  {
    id: "navy",
    name: "United States Navy",
    src: "/images/partners/navy.png",
  },
  {
    id: "air-force",
    name: "United States Air Force",
    src: "/images/partners/air-force.png",
  },
  {
    id: "marines",
    name: "United States Marine Corps",
    src: "/images/partners/marines.png",
  },
  {
    id: "coast-guard",
    name: "United States Coast Guard",
    src: "/images/partners/coast-guard.png",
  },
  {
    id: "space-force",
    name: "United States Space Force",
    src: "/images/partners/space-force.png",
  },
] as const;

/** Upcoming shows — card grid above the footer (news-layout pattern). */
export const upcomingEvents = [
  {
    id: "up-1",
    date: "14.09.2026",
    title: "Heal the World: Live in Munich",
    href: "/contact",
    image: EVENT_PLACEHOLDER_POSTER,
    imageAlt: "Heal the World live performance",
  },
  {
    id: "up-2",
    date: "02.10.2026",
    title: "American Stories Open Air Tour",
    href: "/contact",
    image: EVENT_PLACEHOLDER_POSTER,
    imageAlt: "American Stories open air tour",
  },
  {
    id: "up-3",
    date: "21.11.2026",
    title: "Patriot Night: Film & Live Stage",
    href: "/contact",
    image: EVENT_PLACEHOLDER_POSTER,
    imageAlt: "Patriot Night film and live stage",
  },
] as const;

export const upcomingCopy = {
  eyebrow: "Events",
  title: "Discover our upcoming events",
  seeAll: "See all our events",
  seeAllHref: "/contact",
};

export const contactSubjects = [
  "Book an event",
  "Press & media",
  "Partnerships",
  "General enquiry",
] as const;

export const footerColumns = {
  shows: [
    { label: "Upcoming Events", href: "/#upcoming" },
    { label: "Past Events", href: "/#events" },
    { label: "Venues", href: "/#upcoming" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Merch", href: "/#merch" },
  ],
  connect: [
    { label: "Contact", href: "/contact" },
    { label: "Newsletter", href: "/contact" },
  ],
} as const;
