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
  { label: "Upcoming Events", href: "/#events" },
  { label: "Merch", href: "/#merch" },
] as const;

export const events = [
  {
    id: "event-1",
    title: "Heal the World",
    eyebrow: "Live in Munich",
    placeholder: "Drop event 1 film / photo",
    video: "/videos/event-1.mp4",
  },
  {
    id: "event-2",
    title: "Event Title Two",
    eyebrow: "Previous event",
    placeholder: "Drop event 2 film / photo",
  },
  {
    id: "event-3",
    title: "Event Title Three",
    eyebrow: "Previous event",
    placeholder: "Drop event 3 film / photo",
  },
] as const;

export const milestones = [
  {
    id: "about-1",
    year: "2019",
    body: "Milestone copy goes here — what happened this year and why it mattered.",
    placeholder: "Drop milestone photo",
  },
  {
    id: "about-2",
    year: "2021",
    body: "Milestone copy goes here — what happened this year and why it mattered.",
    placeholder: "Drop milestone photo",
  },
  {
    id: "about-3",
    year: "2023",
    body: "Milestone copy goes here — what happened this year and why it mattered.",
    placeholder: "Drop milestone photo",
  },
  {
    id: "about-4",
    year: "2025",
    body: "Milestone copy goes here — what happened this year and why it mattered.",
    placeholder: "Drop milestone photo",
  },
] as const;

export const aboutCopy = {
  eyebrow: "Our story",
  titleLines: ["A story of", "American", "storytelling"],
  body: "Patriot Media Entertainment builds live shows and film around the people and places that shape this country. Replace this paragraph with your own founding story.",
};

export const ctaCopy = {
  titleLines: ["Unlock the right stage", "with our team"],
  button: "Contact us",
};

export const contactSubjects = [
  "Book an event",
  "Press & media",
  "Partnerships",
  "General enquiry",
] as const;

export const footerColumns = {
  shows: [
    { label: "Upcoming Events", href: "/#events" },
    { label: "Past Events", href: "/#events" },
    { label: "Tickets", href: "/#events" },
    { label: "Venues", href: "/#events" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Merch", href: "/#merch" },
    { label: "Press", href: "/#about" },
    { label: "Careers", href: "/#about" },
  ],
  connect: [
    { label: "Contact", href: "/contact" },
    { label: "Newsletter", href: "/contact" },
  ],
} as const;
