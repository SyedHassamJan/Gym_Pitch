"use client";

import { useRef, type ReactNode } from "react";
import { useMotion, motion } from "@/lib/motion";

/** Plans rise in together, then the featured plan scales up into place. Final state in the server HTML. */
export function FeaturedScale({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, ({ gsap, ScrollTrigger }) => {
    const root = ref.current!;
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    const plans = gsap.utils.toArray<HTMLElement>(".plan");
    const featured = root.querySelector<HTMLElement>("[data-featured]");
    const rest = plans.filter((p) => p !== featured);

    gsap.set(rest, { autoAlpha: 0, y: 24 });
    if (featured) gsap.set(featured, { autoAlpha: 0, scale: 0.9 });

    ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: motion.ease } });
        tl.to(rest, { autoAlpha: 1, y: 0, duration: motion.long, stagger: motion.stagger, clearProps: "all" });
        if (featured) tl.to(featured, { autoAlpha: 1, scale: 1, duration: 0.9, clearProps: "all" }, 0.15);
      },
    });
  });

  return <div ref={ref}>{children}</div>;
}
