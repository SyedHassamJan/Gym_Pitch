"use client";

import { useEffect, useState, type RefObject } from "react";
import { loadScroll } from "@/lib/motion";

/**
 * True once the visitor starts to engage (first scroll, touch, key or click) or the element comes
 * within `margin` of the viewport. Below-the-fold sections mount on this, so their code never
 * loads during the first paint and a visitor who scrolls finds them ready.
 */
export function useMountTrigger(ref: RefObject<HTMLElement | null>, margin = "600px") {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    const go = () => setMounted(true);
    const events = ["scroll", "touchstart", "keydown", "pointerdown", "hashchange"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const io = el ? new IntersectionObserver((es) => es.some((x) => x.isIntersecting) && go(), { rootMargin: `${margin} 0px` }) : null;
    if (el && io) io.observe(el);
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      io?.disconnect();
    };
  }, [mounted, ref, margin]);

  // Section heights may differ slightly from the fallback: re-measure every scroll effect once mounted.
  useEffect(() => {
    if (!mounted) return;
    loadScroll().then(({ ScrollTrigger }) => requestAnimationFrame(() => ScrollTrigger.refresh()));
  }, [mounted]);

  return mounted;
}
