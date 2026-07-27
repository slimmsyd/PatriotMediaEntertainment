export const site = {
  name: "Patriot Media Entertainment",
  wordmark: "PATRIOT MEDIA ENTERTAINMENT",
  viewCount: "23.8 Mio",
  email: "hello@patriotmedia.com",
  bookingsEmail: "bookings@patriotmedia.com",
  phone: "(000) 000-0000",
  addressLines: ["Street address", "City, State ZIP"],
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
    eyebrow: "Live in Munich",
    placeholder: "Drop event 1 film / photo",
    video: EVENT_PLACEHOLDER_VIDEO,
    poster: EVENT_PLACEHOLDER_POSTER,
  },
  {
    id: "event-2",
    title: "Event Title Two",
    eyebrow: "Previous event",
    placeholder: "Drop event 2 film / photo",
    video: EVENT_PLACEHOLDER_VIDEO,
    poster: EVENT_PLACEHOLDER_POSTER,
  },
  {
    id: "event-3",
    title: "Event Title Three",
    eyebrow: "Previous event",
    placeholder: "Drop event 3 film / photo",
    video: EVENT_PLACEHOLDER_VIDEO,
    poster: EVENT_PLACEHOLDER_POSTER,
  },
] as const;

export const aboutCopy = {
  eyebrow: "Our story",
  titleLines: ["A story of", "American", "storytelling"],
  body: "Patriot Media Entertainment builds live shows and film around the people and places that shape this country. Replace this paragraph with your own founding story.",
  cta: "Build with us",
  ctaHref: "/contact",
  /** Cleaned founder / leadership photo — single image on the right of Our Story. */
  founderImage: "/images/about-founder.jpg",
  founderImageAlt:
    "Patriot Media Entertainment leadership at a national event",
};

export const ctaCopy = {
  titleLines: ["Unlock the right stage", "with our team"],
  button: "Contact us",
};

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
