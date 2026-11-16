"use client";

import { useEffect } from "react";
import { loadScroll, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis driven by the GSAP ticker, so smooth scroll and ScrollTrigger share one clock.
 * Skipped entirely under prefers-reduced-motion (native scrolling, no smoothing).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;

    // Lenis starts with the scroll layer, once the page is idle; native scrolling works until then.
    Promise.all([import("lenis"), loadScroll()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      // A visitor who already scrolled keeps their place: Lenis takes over from the current position.
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
      const lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: { offset: -(header + 24) } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      teardown = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
