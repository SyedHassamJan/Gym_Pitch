"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";

export type CoreKit = { gsap: typeof GSAP };
export type MotionKit = CoreKit & { ScrollTrigger: typeof ST };

/** Shared motion tokens, mirrored from globals.css. */
export const motion = {
  ease: "expo.out",
  easeInOut: "power3.inOut",
  long: 0.8,
  stagger: 0.08,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- loading: GSAP core first, ScrollTrigger + scroll work when the main thread is idle ---------- */

let core: Promise<CoreKit> | null = null;
let scroll: Promise<MotionKit> | null = null;

/** GSAP core only (about 25 KB): enough for the hero intro. */
export function loadCore() {
  core ??= import("gsap").then(({ gsap }) => ({ gsap }));
  return core;
}

/** Resolves on the first idle period after the page has loaded (or after `timeout` ms at most). */
function afterIdle(timeout = 2500) {
  return new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(() => resolve(), { timeout }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

/** GSAP + ScrollTrigger, fetched once the page is idle so it never competes with first paint. */
export function loadScroll() {
  scroll ??= afterIdle().then(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([loadCore(), import("gsap/ScrollTrigger")]);
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return scroll;
}

/* ---------- scheduling: one setup per task, so no single task blocks input for long ---------- */

const queue: (() => void)[] = [];
let draining = false;
function drain() {
  const job = queue.shift();
  if (!job) {
    draining = false;
    return;
  }
  job();
  setTimeout(drain, 0); // yield to the browser between setups
}
function schedule(job: () => void) {
  queue.push(job);
  if (!draining) {
    draining = true;
    setTimeout(drain, 0);
  }
}

type Setup<K> = (kit: K) => void | (() => void);

function useKit<K extends CoreKit>(scope: RefObject<HTMLElement | null>, load: () => Promise<K>, setup: Setup<K>, queued: boolean) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: ReturnType<typeof GSAP.context> | undefined;
    let cleanup: void | (() => void);

    const run = (k: K) => {
      if (cancelled || !scope.current) return;
      ctx = k.gsap.context(() => {
        cleanup = setup(k);
      }, scope.current);
    };
    load().then((k) => (queued ? schedule(() => run(k)) : run(k)));

    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // Setup is intentionally run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** GSAP core only, run as soon as it loads (the hero intro). */
export function useIntro(scope: RefObject<HTMLElement | null>, setup: Setup<CoreKit>) {
  useKit(scope, loadCore, setup, false);
}

/**
 * GSAP + ScrollTrigger, set up after the page is idle, one component per task.
 * Content stays visible until then; reveals only hide what is still below the fold.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: Setup<MotionKit>) {
  useKit(scope, loadScroll, setup, true);
}
