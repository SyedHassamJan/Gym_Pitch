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
  sections/     Hero, Stats, About, Programs, Coaches, Membership, Proof, Faq, LeadForm
  motion/       SmoothScroll, HeroIntro, Reveal, Counter, Parallax, ProgramStack, FeaturedScale, Magnetic
  ui/           TrialButton
lib/            content.ts, motion.ts (lazy GSAP hook), gsap.ts (the lazily loaded chunk)
```

## Motion

GSAP, ScrollTrigger and Lenis load lazily (`lib/motion.ts` → `useMotion`) so they never block the
hero image. Lenis is driven by the GSAP ticker and synced to ScrollTrigger. Under
`prefers-reduced-motion` nothing animates and Lenis is skipped; with JavaScript off the page renders
complete (no preloader, no hidden content).
