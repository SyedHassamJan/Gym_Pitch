"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, m, useReducedMotion } from "framer-motion";
import { bodyScan, programName, type ZoneId } from "@/lib/content";
import { useMotion } from "@/lib/motion";
import { TrialButton } from "@/components/ui/TrialButton";
import { BodyFigure, FIGURE, ZONE_GEOMETRY } from "./BodyFigure";

const loadFeatures = () => import("./motion-max").then((r) => r.default);
const ORDER = bodyScan.zones.map((z) => z.id);
const ALL = new Set<ZoneId>(ORDER);
const TAGS = Object.fromEntries(bodyScan.zones.map((z) => [z.id, z.tag])) as Record<ZoneId, string>;

/** Zones the scan line has passed, for a line at `y` in figure units. */
const litAt = (y: number) => new Set(ORDER.filter((id) => ZONE_GEOMETRY[id].y <= y));

export function BodyScan() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLElement>(null);
  const [scanned, setLit] = useState<Set<ZoneId>>(() => new Set());
  const [selected, setSelected] = useState<ZoneId | null>(null);
  const litCount = useRef(-1);
  // Reduced motion: no sweep, every zone lit.
  const lit = reduced ? ALL : scanned;

  const updateFromLine = useCallback((y: number) => {
    const next = litAt(y);
    if (next.size !== litCount.current) {
      litCount.current = next.size;
      setLit(next);
    }
  }, []);

  useMotion(wrapRef, ({ gsap, ScrollTrigger }) => {
    const wrap = wrapRef.current!;
    const pin = wrap.querySelector<HTMLElement>("[data-scan-pin]")!;
    const line = wrap.querySelector<SVGGElement>("[data-scan-line]")!;
    const figure = wrap.querySelector<HTMLElement>("[data-scan-figure]")!;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
    const state = { y: FIGURE.scanFrom };
    const sweep = { y: FIGURE.scanTo, ease: "none", onUpdate: () => updateFromLine(state.y) };
    const draw = () => gsap.set(line, { y: state.y });

    const mm = gsap.matchMedia();

    // Desktop: pin the section and scrub the scan line top to bottom.
    mm.add("(min-width: 60.01rem)", () => {
      wrap.classList.add("is-pinned-by-gsap");
      draw();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: `top top+=${header}`,
          end: "bottom bottom",
          pin,
          pinSpacing: false,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(state, { ...sweep, onUpdate: () => (draw(), updateFromLine(state.y)) });
      return () => wrap.classList.remove("is-pinned-by-gsap");
    });

    // Mobile: no pin. The figure reveals top to bottom once, behind a single sweep.
    mm.add("(max-width: 60rem)", () => {
      if (figure.getBoundingClientRect().top < window.innerHeight * 0.75) {
        updateFromLine(FIGURE.scanTo);
        gsap.set(line, { autoAlpha: 0 });
        return;
      }
      draw();
      gsap.set(figure, { clipPath: "inset(0% 0% 100% 0%)" });
      ScrollTrigger.create({
        trigger: figure,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(figure, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" }, 0)
            .to(state, { ...sweep, duration: 1.6, ease: "power2.inOut", onUpdate: () => (draw(), updateFromLine(state.y)) }, 0)
            .to(line, { autoAlpha: 0, duration: 0.3 });
        },
      });
    });

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => mm.revert();
  });

  const select = (id: ZoneId, fromFigure = false) => {
    setSelected((cur) => (cur === id ? null : id));
    if (fromFigure && window.matchMedia("(max-width: 60rem)").matches) {
      requestAnimationFrame(() => document.getElementById(`zone-btn-${id}`)?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }));
    }
  };

  const shown = useMemo(() => (selected ? new Set([...lit, selected]) : lit), [lit, selected]);

  return (
    <MotionConfig reducedMotion="user" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32 }}>
      <LazyMotion features={loadFeatures} strict>
        <section className="scan" id="scan" aria-labelledby="scan-title" ref={wrapRef}>
          <div className="scan__pin" data-scan-pin>
            <div className="container scan__grid">
              <div className="scan__figure" data-scan-figure>
                <BodyFigure lit={shown} selected={selected} tags={TAGS} />
                {bodyScan.zones.map((z) => {
                  const [x, y] = ZONE_GEOMETRY[z.id].hot;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      className={`hotspot${selected === z.id ? " is-selected" : ""}`}
                      style={{ left: `${(x / FIGURE.width) * 100}%`, top: `${(y / FIGURE.height) * 100}%` }}
                      aria-label={`${z.name}: how FitPro trains it`}
                      aria-expanded={selected === z.id}
                      aria-controls={`zone-panel-${z.id}`}
                      onClick={() => select(z.id, true)}
                    >
                      <span className="hotspot__dot" aria-hidden="true" />
                      <span className="hotspot__label" aria-hidden="true">
                        {z.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="scan__copy">
                <h2 id="scan-title" className="display h-section">
                  {bodyScan.heading}
                </h2>
                <p className="lead">{bodyScan.lede}</p>
                <ul className="zone-list">
                  {bodyScan.zones.map((z) => {
                    const open = selected === z.id;
                    return (
                      <m.li key={z.id} layout="position" className={`zone-row${lit.has(z.id) ? " is-lit" : ""}${open ? " is-open" : ""}`}>
                        <button
                          id={`zone-btn-${z.id}`}
                          type="button"
                          className="zone-row__btn"
                          aria-expanded={open}
                          aria-controls={`zone-panel-${z.id}`}
                          onClick={() => select(z.id)}
                        >
                          <span className="zone-row__name">{z.name}</span>
                          <span className="zone-row__tag">{z.tag}</span>
                          <svg className="zone-row__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <m.div
                              key="panel"
                              id={`zone-panel-${z.id}`}
                              role="region"
                              aria-labelledby={`zone-btn-${z.id}`}
                              className="zone-panel"
                              layout
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8, transition: { duration: reduced ? 0 : 0.16 } }}
                            >
                              <h3 className="h-title zone-panel__title">
                                {z.name} in {programName(z.program)}
                              </h3>
                              <ol className="zone-panel__moves">
                                {z.exercises.map((ex) => (
                                  <li key={ex}>{ex}</li>
                                ))}
                              </ol>
                              <TrialButton size="sm" message={`Hi FitPro, I'd like to book my free trial class. I want to work on my ${z.name.toLowerCase()}.`} />
                            </m.div>
                          )}
                        </AnimatePresence>
                      </m.li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  );
}
