/**
 * Every word, price, person and number on the page lives here.
 * Swap this file to rebrand the site.
 *
 * Sources: copy and prices from the Pulse project, hours from FitPro,
 * class schedule and equipment list from the GYM-Website project.
 * Anything marked CONFIRM is placeholder content that must be checked
 * with the gym before launch.
 */

export const site = {
  name: "FitPro",
  url: "https://fitpro.example.com", // CONFIRM: the real domain (used by metadata, sitemap, JSON-LD)
  city: "Lahore",
  country: "PK",
  description:
    "FitPro is a Lahore gym for strength training, HIIT, mobility and one-on-one coaching. Book a free trial class on WhatsApp.",
  // CONFIRM: Pulse's placeholder number. International format, digits only.
  whatsapp: "923000000000",
  whatsappDisplay: "+92 300 0000000",
  email: "", // CONFIRM: leave empty to hide
  address: "", // CONFIRM: street address; shown as a fill-in slot until set
  mapsQuery: "FitPro gym Lahore", // what the "Open in Maps" link searches for
  copyrightYear: 2026,
  socials: [
    // CONFIRM: add real profiles; the footer hides this list while it is empty.
    // { label: "Instagram", href: "https://instagram.com/..." },
  ] as { label: string; href: string }[],
  newsletterEndpoint: "", // CONFIRM: a POST endpoint; the form says plainly that it is not connected until set
};

export const offer = {
  cta: "Book Your Free Trial Class",
  ctaShort: "Free trial",
  afterClick: "Opens WhatsApp with a message ready. We reply with a class time.",
  message: "Hi FitPro, I'd like to book my free trial class.",
};

export function whatsappLink(message: string = offer.message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const hours = {
  label: "Monday to Saturday",
  open: "08:00",
  close: "19:00",
  // schema.org openingHours
  schema: "Mo-Sa 08:00-19:00",
};

export const hero = {
  headline: ["Train harder.", "Live stronger."],
  sentence: "Strength, HIIT and real coaching in Lahore, for goals you thought impossible.",
  image: {
    src: "/images/header-2.jpg",
    width: 1800,
    height: 1400,
    alt: "A lifter low in a barbell squat on a dark gym floor",
  },
};

// CONFIRM: figures from the Pulse copy. Replace with the gym's real numbers.
export const stats = [
  { value: 500, suffix: "+", decimals: 0, label: "active members" },
  { value: 12, suffix: "", decimals: 0, label: "expert trainers" },
  { value: 8, suffix: "", decimals: 0, label: "weekly programs" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "member rating" },
];

export const about = {
  heading: "Coached sessions, six days a week",
  body: "A full strength floor, HIIT, mobility and one-on-one coaching, all guided by certified coaches.",
  image: {
    src: "/images/carousel-1.jpg",
    width: 1920,
    height: 1080,
    alt: "The FitPro strength floor: racks, benches and cable machines in rows",
  },
};

export type Program = {
  id: string;
  name: string;
  body: string;
  image: { src: string; width: number; height: number; alt: string; position?: string };
};

export const programs: Program[] = [
  {
    id: "strength",
    name: "Strength Training",
    body: "Build raw power with structured progressive-overload programs guided by certified coaches.",
    image: { src: "/images/work-12.jpg", width: 600, height: 500, alt: "A woman lifting a barbell from the floor", position: "50% 40%" },
  },
  {
    id: "hiit",
    name: "HIIT & Cardio",
    body: "High-intensity sessions designed to burn fat fast and boost cardiovascular endurance.",
    image: { src: "/images/services-img.jpg", width: 1920, height: 1080, alt: "Two members doing push-ups side by side", position: "50% 55%" },
  },
  {
    id: "mobility",
    name: "Yoga & Mobility",
    body: "Recover smarter with mobility-focused sessions that keep you injury-free and flexible.",
    image: { src: "/images/naam-yoga-la-class-1920.jpg", width: 1920, height: 1327, alt: "A yoga class stretching arms overhead in a wooden-floored studio", position: "50% 45%" },
  },
  {
    id: "coaching",
    name: "1-on-1 Coaching",
    body: "Personalised training plans and nutrition guidance tailored to your specific goals.",
    image: { src: "/images/goal-background-img.jpg", width: 1920, height: 1300, alt: "A coach working a medicine-ball drill with a client", position: "50% 35%" },
  },
];

// Sample timetable, built on the GYM-Website schedule (09:00 to 10:00 daily). CONFIRM.
export const schedule = [
  { day: "Monday", time: "09:00 to 10:00", program: "strength" },
  { day: "Tuesday", time: "09:00 to 10:00", program: "hiit" },
  { day: "Wednesday", time: "09:00 to 10:00", program: "mobility" },
  { day: "Thursday", time: "09:00 to 10:00", program: "strength" },
  { day: "Friday", time: "09:00 to 10:00", program: "hiit" },
  { day: "Saturday", time: "09:00 to 10:00", program: "mobility" },
] as const;

export function programName(id: string) {
  return programs.find((p) => p.id === id)?.name ?? id;
}

// CONFIRM: photos are FitPro template stand-ins; add each coach's real name and photo.
export const trainers = [
  { name: "", role: "Strength coach", focus: "Barbell technique and progressive overload", image: { src: "/images/team-2.jpg", alt: "Strength coach" } },
  { name: "", role: "HIIT & conditioning", focus: "Intervals, circuits and engine work", image: { src: "/images/team-1.jpg", alt: "HIIT and conditioning coach" } },
  { name: "", role: "Mobility & yoga", focus: "Range of motion, recovery and breath", image: { src: "/images/team-4.jpg", alt: "Mobility and yoga coach" } },
  { name: "", role: "Personal training", focus: "One-on-one plans and nutrition guidance", image: { src: "/images/team-3.jpg", alt: "Personal training coach" } },
];

export const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 4000,
    features: ["Gym floor access", "Locker room", "2 group classes a week"],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 7000,
    features: ["Unlimited gym access", "Unlimited classes", "1 PT session a month", "Diet consultation"],
    featured: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 12000,
    features: ["Everything in Pro", "4 PT sessions a month", "Custom meal plan"],
    featured: false,
  },
];

export const currency = { code: "PKR", label: "Rs" };

/**
 * Real member quotes only, with the member's permission.
 * The section shows a fill-in slot while this list is empty.
 * Shape: { quote: "…", name: "First name L.", detail: "Pro member since 2025" }
 */
export const testimonials: { quote: string; name: string; detail?: string }[] = [];

// Stand-in photos from the FitPro template. CONFIRM: replace with real member photos (with consent).
export const transformations = [
  { src: "/images/work-10.jpg", width: 600, height: 500, alt: "A boxer in gloves under warm light" },
  { src: "/images/work-5.jpg", width: 600, height: 500, alt: "A veteran lifter mid cable row" },
  { src: "/images/work-11.jpg", width: 600, height: 500, alt: "A lifter from behind at the cable station" },
  { src: "/images/work-9.jpg", width: 600, height: 500, alt: "A woman holding a deep squat under the bar" },
  { src: "/images/work-1.jpg", width: 600, height: 500, alt: "A leg press set on the strength floor" },
  { src: "/images/work-3.jpg", width: 600, height: 500, alt: "A one-arm dumbbell row on the bench" },
];

export const faq = [
  {
    q: "What happens in the free trial class?",
    a: "You join one scheduled class with a coach. Message us on WhatsApp, pick a time from the timetable, and bring water and trainers.",
  },
  {
    q: "When is FitPro open?",
    a: `${hours.label}, ${hours.open} to ${hours.close}. Group classes run at 09:00.`,
  },
  {
    q: "Which plan includes personal training?",
    a: "Pro includes one PT session a month and a diet consultation. Elite includes four sessions a month and a custom meal plan.",
  },
  {
    q: "What equipment is on the floor?",
    a: "Cardiovascular machines, strength training equipment, a group fitness studio and locker rooms.",
  },
];

export const goals = ["Build strength", "Lose fat", "Improve mobility", "Personal coaching", "Not sure yet"];

export const nav = [
  { href: "#programs", label: "Programs" },
  { href: "#coaches", label: "Coaches" },
  { href: "#membership", label: "Membership" },
  { href: "#faq", label: "FAQ" },
];

// Library photo credits (CC licences require them on the page).
export const credits = [
  { label: "Drmirshak", href: "https://commons.wikimedia.org/wiki/File:Naam_Yoga_LA_Class.jpg", licence: "CC BY-SA 3.0" },
];
