"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { useMountTrigger } from "@/components/motion/useMountTrigger";

// Split into their own chunks; fetched only when the visitor engages or nears the section.
const BodyScan = dynamic(() => import("./BodyScan").then((m) => m.BodyScan), { ssr: false });
const Calculator = dynamic(() => import("./Calculator").then((m) => m.Calculator), { ssr: false });

/** `children` is the server-rendered fallback (also what visitors without JavaScript see). */
function Lazy({ children, render }: { children: ReactNode; render: () => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMountTrigger(ref);
  return mounted ? <>{render()}</> : <div ref={ref}>{children}</div>;
}

export function LazyBodyScan({ children }: { children: ReactNode }) {
  return <Lazy render={() => <BodyScan />}>{children}</Lazy>;
}

export function LazyCalculator({ children }: { children: ReactNode }) {
  return <Lazy render={() => <Calculator />}>{children}</Lazy>;
}
