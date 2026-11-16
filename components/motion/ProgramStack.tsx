"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "@/lib/motion";

/**
 * The page's one pinned moment. Cards stick in CSS (position: sticky), so the stack works with
 * no script; GSAP only scrubs each covered card back (scale + dim) as the next one slides over it.
 */
export function ProgramStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 48.01rem)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-program-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const dim = card.querySelector("[data-program-dim]");
        gsap
          .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=160", scrub: true } })
          .to(card, { scale: 0.94, ease: "none" }, 0)
          .to(dim, { opacity: 0.55, ease: "none" }, 0);
      });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className="stack">
      {children}
    </div>
  );
}
