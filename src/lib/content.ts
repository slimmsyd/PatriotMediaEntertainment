import {
  EVENT_1_POSTER,
  EVENT_1_VIDEO,
  EVENT_2_POSTER,
  EVENT_2_VIDEO,
  EVENT_3_POSTER,
  EVENT_3_VIDEO,
  EVENT_4_POSTER,
  EVENT_4_VIDEO,
  EVENT_5_POSTER,
  EVENT_5_VIDEO,
  WOUNDED_WARRIORS_IMAGE,
  WOUNDED_WARRIORS_POSTER,
  WOUNDED_WARRIORS_VIDEO,
} from "@/lib/media";

export const site = {
  name: "Patriot Entertainment & Media Group",
  wordmark: "PATRIOT ENTERTAINMENT & MEDIA GROUP",
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
] as const;

/**
 * Past-events rail. Three shapes: showcase films (`kind: "film"`, full-bleed
 * video), real event flyers (`kind: "flyer"`, portrait artwork shown whole
 * against a blurred fill of itself), and duo showcases (`kind: "duo"`, live
 * footage paired with a still — moment + proof in one tile).
 */
export type PastEvent =
  | {
      kind: "film";
      id: string;
      title: string;
      eyebrow: string;
      video: string;
      poster: string;
    }
  | {
      kind: "flyer";
      id: string;
      title: string;
      eyebrow: string;
      /** Date + venue line under the title. */
      meta: string;
      image: string;
      imageAlt: string;
    }
  | {
      kind: "duo";
      id: string;
      title: string;
      eyebrow: string;
      /** Date + partners / impact line under the title. */
      meta: string;
      video: string;
      poster: string;
      image: string;
      imageAlt: string;
    };

export const events: readonly PastEvent[] = [
  {
    kind: "duo",
    id: "wounded-warriors",
    title: "Wounded Warriors Event",
    eyebrow: "Benefit",
    meta: "Sat. June 3 · $1,000 to Wounded Warrior Project · Mothers & Fathers Against Crime",
    video: WOUNDED_WARRIORS_VIDEO,
    poster: WOUNDED_WARRIORS_POSTER,
    image: WOUNDED_WARRIORS_IMAGE,
    imageAlt:
      "Group presenting a ceremonial $1,000 check to the Wounded Warrior Project from Mothers and Fathers Against Crime at an outdoor fundraising event",
  },
  {
    kind: "flyer",
    id: "prayer-candlelight-vigil",
    title: "Prayer & Candlelight Vigil",
    eyebrow: "Community",
    meta: "July 18, 2026 · Kingdom Ambassadors Center, Manassas, VA",
    image: "/images/prayer-candlelight-vigil.jpg",
    imageAlt:
      "Prayer & Candlelight Vigil honoring our soldiers, July 18 2026 at Kingdom Ambassadors Center in Manassas, Virginia",
  },
  {
    kind: "flyer",
    id: "pre-new-years-party-2025",
    title: "Pre New Year's Party",
    eyebrow: "Elvis Tribute",
    meta: "December 30, 2025 · ALC Potomac Place, Woodbridge, VA",
    image: "/images/pre-new-years-party-elvis.jpg",
    imageAlt:
      "Pre New Year's Party with Elvis tribute artist Lionel Ward, December 30 2025 at ALC Assisted Living Center Potomac Place in Woodbridge, Virginia",
  },
  {
    kind: "flyer",
    id: "benefit-concert-austin-hankins",
    title: "Benefit Concert for Austin Hankins",
    eyebrow: "Benefit",
    meta: "December 4, 2024 · Bearded Monkey, Fredericksburg, VA",
    image: "/images/benefit-concert-austin-hankins.jpg",
    imageAlt:
      "Benefit Concert for Austin Hankins featuring All In One Band and The Home Grown Band, December 4 2024 at Bearded Monkey in Fredericksburg, Virginia",
  },
  {
    kind: "film",
    id: "event-1",
    title: "Heal the World",
    eyebrow: "Pop",
    video: EVENT_1_VIDEO,
    poster: EVENT_1_POSTER,
  },
  {
    kind: "film",
    id: "event-2",
    title: "Our Breath",
    eyebrow: "Folk",
    video: EVENT_2_VIDEO,
    poster: EVENT_2_POSTER,
  },
  {
    kind: "film",
    id: "event-3",
    title: "Kirk Franklin",
    eyebrow: "Gospel",
    video: EVENT_3_VIDEO,
    poster: EVENT_3_POSTER,
  },
  {
    kind: "film",
    id: "event-4",
    title: "Miranda Lambert",
    eyebrow: "Country",
    video: EVENT_4_VIDEO,
    poster: EVENT_4_POSTER,
  },
  {
    kind: "film",
    id: "event-5",
    title: "Nickelback",
    eyebrow: "Rock",
    video: EVENT_5_VIDEO,
    poster: EVENT_5_POSTER,
  },
];

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
  /** Founder portrait — single image on the right of Who We Are. */
  founderImage: "/images/reggie.jpg",
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

export type UpcomingEvent = {
  id: string;
  /** Displayed as DD.MM.YYYY — parsed into a real datetime attribute. */
  date: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
};

/**
 * Upcoming shows — the rail above the footer. Real dates only; the section
 * hides itself when this is empty rather than showing invented listings.
 */
export const upcomingEvents: readonly UpcomingEvent[] = [
  {
    id: "fredericksburg-food-coop-2026",
    date: "03.10.2026",
    title: "Fredericksburg Food Co-op Membership Drive",
    href: "/contact",
    image: "/images/fredericksburg-food-coop.jpg",
    imageAlt:
      "Fredericksburg Food Co-op Membership Drive with mini concert and fall fashion show, Saturday October 3 2026 at 320 Emancipation Highway, Fredericksburg, Virginia",
  },
];

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
  company: [{ label: "About Us", href: "/#about" }],
  connect: [
    { label: "Contact", href: "/contact" },
    { label: "Newsletter", href: "/contact" },
  ],
} as const;
