"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { useMotion, motion } from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Animate descendants marked [data-reveal] in sequence instead of the wrapper itself. */
  stagger?: boolean;
  y?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * The page's one reveal: a fade with a short rise, once.
 * Content is fully visible in the server HTML; it is only hidden after GSAP loads,
 * and only while still below the fold, so a failed script never blanks the page.
 */
export function Reveal<T extends ElementType = "div">({ as, children, stagger = false, y = 24, ...rest }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useMotion(ref, ({ gsap, ScrollTrigger }) => {
    const root = ref.current!;
    const targets = stagger ? Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")) : [root];
    if (!targets.length || root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    gsap.set(targets, { autoAlpha: 0, y });
    ScrollTrigger.create({
      trigger: root,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: motion.long,
          ease: motion.ease,
          stagger: stagger ? motion.stagger : 0,
          clearProps: "transform,opacity,visibility",
        }),
    });
  });

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
