"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/motion";

type CounterProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts up to its value once when it scrolls into view.
 * The server HTML and reduced-motion users get the final figure.
 */
export function Counter({ value, decimals = 0, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useMotion(ref, ({ gsap, ScrollTrigger }) => {
    const el = ref.current!;
    // Already on screen when motion arrived: keep the final figure rather than reset it to 0.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const state = { n: 0 };
    const render = () => (el.textContent = format(state.n, decimals) + suffix);
    render();
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(state, {
          n: value,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: render,
          onComplete: () => {
            state.n = value;
            render();
          },
        }),
    });
    return () => {
      el.textContent = format(value, decimals) + suffix;
    };
  });

  return (
    <span ref={ref} className={className}>
      {format(value, decimals) + suffix}
    </span>
  );
}
