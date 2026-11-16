"use client";

import { useEffect } from "react";
import { loadMotion, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis driven by the GSAP ticker, so smooth scroll and ScrollTrigger share one clock.
 * Skipped entirely under prefers-reduced-motion (native scrolling, no smoothing).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;

    Promise.all([import("lenis"), loadMotion()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
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
