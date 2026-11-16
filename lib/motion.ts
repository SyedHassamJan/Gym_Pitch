"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";

export type MotionKit = { gsap: typeof GSAP; ScrollTrigger: typeof ST };
type Setup = (kit: MotionKit) => void | (() => void);

/** Shared motion tokens, mirrored from globals.css. */
export const motion = {
  ease: "expo.out",
  easeInOut: "power3.inOut",
  long: 0.8,
  stagger: 0.08,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let kit: Promise<MotionKit> | null = null;
/** One shared, lazily loaded GSAP + ScrollTrigger chunk. */
export function loadMotion() {
  kit ??= import("./gsap");
  return kit;
}

/**
 * Runs a GSAP setup inside a gsap.context scoped to `scope`, after GSAP has loaded.
 * Never runs under prefers-reduced-motion; everything is reverted on unmount.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: Setup) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: ReturnType<typeof GSAP.context> | undefined;
    let cleanup: void | (() => void);

    loadMotion().then((k) => {
      if (cancelled || !scope.current) return;
      ctx = k.gsap.context(() => {
        cleanup = setup(k);
      }, scope.current);
    });

    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // Setup is intentionally run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
