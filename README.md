# FitPro

Single-page site for a Lahore gym. Next.js 16 (App Router), TypeScript, Tailwind v4, GSAP + ScrollTrigger + Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Rebrand or update content

Everything a visitor reads lives in `lib/content.ts`: name, domain, WhatsApp number, hours, prices,
programs, timetable, coaches, FAQ, testimonials and photo credits. Items marked `CONFIRM` are
placeholders to check with the gym before launch:

- `site.url`, `site.whatsapp`, `site.address`, `site.email`, `site.socials`, `site.newsletterEndpoint`
- `stats` (from the Pulse template copy)
- `schedule` (sample timetable)
- `trainers` names and photos (template stand-ins)
- `transformations` photos (template stand-ins; use real member photos with consent)
- `testimonials` (empty: the section shows a fill-in slot until real quotes are added)

Images live in `public/images`. The yoga photo is CC BY-SA 3.0 (credited in the footer).

## Structure

```
app/            layout (fonts, metadata, JSON-LD), page, globals.css (tokens + styles),
                opengraph-image, icon, sitemap, robots
components/
  layout/       Header, MobileMenu, Footer, Newsletter
  sections/     Hero, Stats, About, BodyScan (+ BodyFigure, fallback), Programs, Calculator (+ fallback),
                Coaches, Membership, Proof, Faq, LeadForm; lazy.tsx mounts the two heavy sections on demand
  motion/       SmoothScroll, HeroIntro, Reveal, Counter, Parallax, ProgramStack, FeaturedScale, Magnetic
  ui/           TrialButton
lib/            content.ts, motion.ts (lazy GSAP loading + useIntro / useMotion hooks),
                nutrition.ts (Mifflin-St Jeor estimate with safety floors)
```

## Motion

Motion never blocks first paint (`lib/motion.ts`):

- `useIntro` loads GSAP core only, right after hydration, for the hero intro.
- `useMotion` loads ScrollTrigger once the browser is idle after `load`, then sets up each scroll
  effect in its own task so none of them blocks input for long.
- Lenis starts with the scroll layer, driven by the GSAP ticker and synced to ScrollTrigger.

The preloader is pure CSS (about 0.8 s) and never waits on JavaScript.

GSAP handles scroll-linked and pinned effects only; Framer Motion handles state-driven UI only
(`LazyMotion` with `domAnimation` in the calculator, `domMax` loaded on demand in the body scan
because layout animations are not part of `domAnimation`).

The body scan and the calculator are server-rendered as light fallbacks and swapped for the real
sections (`next/dynamic`, `ssr: false`) on the visitor's first scroll, tap or key press, or when they
come within 600px of the viewport. Their code never loads during first paint.

## Calculator maths (`lib/nutrition.ts`)

BMR by Mifflin-St Jeor, times an activity factor (1.2 to 1.9) for maintenance. Lose fat: a 20% deficit
clamped to 300 to 600 kcal. Build muscle: a 10% surplus clamped to 150 to 350 kcal. Targets never go
below 1,500 kcal (male) or 1,200 kcal (female). Inputs outside age 16 to 80, height 130 to 220 cm or
weight 35 to 250 kg are rejected. Under
`prefers-reduced-motion` nothing animates and Lenis is skipped; with JavaScript off the page renders
complete (no preloader, no hidden content).
