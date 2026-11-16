"use client";

import { useRef, type ReactNode } from "react";
import { useIntro, motion } from "@/lib/motion";

/** When the CSS preloader finishes leaving (globals.css: 420ms delay + 400ms). */
const PRELOADER_DONE = 0.82;

/**
 * Hero entrance: masked, staggered headline lines and a skewed curtain wiping off the photograph.
 * The hidden start state is set in CSS under html.motion (with a self-running safety reveal),
 * so nothing flashes before GSAP loads and nothing stays hidden if it never does.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIntro(ref, ({ gsap }) => {
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;

    const root = ref.current!;
    const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
    // The sentence and button are visible in the server HTML. Only fade them in when we got here
    // before the preloader left; on a slow device they are already on screen, so leave them be.
    const early = performance.now() / 1000 < PRELOADER_DONE;
    const fades = early ? gsap.utils.toArray<HTMLElement>("[data-hero-fade]") : [];
    const curtain = root.querySelector<HTMLElement>("[data-hero-curtain]");
    const shot = root.querySelector<HTMLElement>("[data-hero-shot]");

    // Take over from the CSS start state in the same frame. y: 0 stops GSAP inheriting
    // the CSS translateY(105%) as a pixel offset.
    gsap.set(lines, { y: 0, yPercent: 105 });
    if (curtain) gsap.set(curtain, { x: 0, xPercent: 0 });
    if (fades.length) gsap.set(fades, { autoAlpha: 0, y: 12 });
    html.classList.add("motion-run");

    const delay = Math.max(0, PRELOADER_DONE - performance.now() / 1000);
    const tl = gsap.timeline({ delay, defaults: { ease: motion.ease } });
    tl.to(lines, { yPercent: 0, duration: 0.75, stagger: 0.1 });
    if (curtain) tl.to(curtain, { xPercent: 101, duration: 0.75, ease: motion.easeInOut }, 0.1);
    if (shot) tl.from(shot, { scale: 1.12, duration: 1.4, ease: "power2.out", clearProps: "scale" }, 0.1);
    if (fades.length) tl.to(fades, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, clearProps: "transform,opacity,visibility" }, 0.45);
  });

  return <div ref={ref}>{children}</div>;
}
