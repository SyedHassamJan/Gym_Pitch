"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "@/lib/motion";

/**
 * Scrubbed parallax for children marked [data-speed] (yPercent travel, e.g. "-12" or "10").
 * Desktop only, never under reduced motion; transform only.
 */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 60.01rem)", () => {
      ref.current?.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const travel = parseFloat(el.dataset.speed ?? "0");
        gsap.fromTo(
          el,
          { yPercent: -travel / 2 },
          {
            yPercent: travel / 2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
