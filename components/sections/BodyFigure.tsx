import type { ZoneId } from "@/lib/content";

/*
 * Original X-ray style figure, drawn for FitPro in a 300 x 640 box.
 * Left-side shapes are written once as "x,y" pairs and mirrored across x = 150.
 */

export const FIGURE = { width: 300, height: 640, scanFrom: 20, scanTo: 630 };

const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${300 - Number(x)},${y}`);
const both = (d: string) => [d, mirror(d)];

/** Where each zone sits: scan threshold (y), hotspot position, and its label. */
export const ZONE_GEOMETRY: Record<ZoneId, { y: number; hot: [number, number]; label: { x: number; y: number; side: "left" | "right"; from: [number, number] } }> = {
  shoulders: { y: 128, hot: [212, 140], label: { x: 246, y: 120, side: "right", from: [214, 132] } },
  chest: { y: 150, hot: [126, 156], label: { x: 54, y: 150, side: "left", from: [104, 156] } },
  back: { y: 212, hot: [194, 214], label: { x: 246, y: 214, side: "right", from: [204, 214] } },
  core: { y: 246, hot: [150, 246], label: { x: 54, y: 262, side: "left", from: [130, 258] } },
  legs: { y: 400, hot: [126, 414], label: { x: 246, y: 414, side: "right", from: [172, 414] } },
};

const ZONE_PATHS: Record<ZoneId, string[]> = {
  shoulders: both("M86,122 Q72,132 74,162 Q84,152 98,150 Q102,132 92,121 Z"),
  chest: both("M147,124 L101,130 Q97,150 103,171 Q126,185 147,177 Z"),
  back: both("M99,178 Q90,212 103,252 Q112,236 116,202 Q110,186 99,178 Z"),
  core: ["M129,188 Q150,182 171,188 L169,300 Q150,313 131,300 Z"],
  legs: both("M111,362 Q102,420 111,472 Q124,482 135,471 Q143,420 146,366 Q130,356 111,362 Z"),
};

// Silhouette, drawn faint.
const OUTLINE = [
  "M136,108 L104,114 Q86,118 84,136 L88,190 Q96,240 104,262 Q100,300 104,330 L112,352 L188,352 L196,330 Q200,300 196,262 Q204,240 212,190 L216,136 Q214,118 196,114 L164,108",
  ...both("M86,124 Q70,140 68,190 L66,250 Q62,300 60,352 Q60,370 66,382 L76,382 Q80,368 78,352 Q82,300 86,252 L97,170"),
  ...both("M112,352 Q104,420 108,480 Q106,540 110,600 L106,624 Q120,632 135,625 L132,600 Q136,540 134,480 Q142,420 149,362"),
  "M138,92 L136,108 M162,92 L164,108",
];

// Skeleton.
const BONES = [
  ...both("M146,113 Q122,107 97,118"), // clavicles
  ...both("M92,126 L78,248"), // humerus
  ...both("M78,254 L66,350 M85,254 L75,350"), // radius, ulna
  ...both("M64,356 L60,374 M70,357 L68,377 M76,356 L76,374"), // hand
  ...both("M124,356 L120,478"), // femur
  ...both("M118,492 L116,604 M126,494 L124,602"), // tibia, fibula
  ...both("M112,610 L134,620"), // foot
  "M112,320 Q108,350 128,356 Q140,340 150,350 Q160,340 172,356 Q192,350 188,320 Q170,330 150,326 Q130,330 112,320 Z", // pelvis
  "M132,74 Q150,98 168,74 M138,80 L162,80", // jaw, teeth
  "M146,64 L150,72 L154,64", // nasal
];
const RIBS = Array.from({ length: 7 }, (_, i) => {
  const y = 128 + i * 15;
  return both(`M147,${y} C126,${y - 5} 107,${y + 6} 110,${y + 22}`);
}).flat();
const VERTEBRAE = Array.from({ length: 21 }, (_, i) => 96 + i * 11.6);

export function BodyFigure({ lit, selected, tags }: { lit: Set<ZoneId>; selected: ZoneId | null; tags: Record<ZoneId, string> }) {
  return (
    <svg className="figure" viewBox={`0 0 ${FIGURE.width} ${FIGURE.height}`} role="img" aria-labelledby="figure-title">
      <title id="figure-title">Line drawing of a body, X-ray style, with five training zones marked</title>
      <defs>
        <pattern id="scan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20,0 L0,0 L0,20" className="figure__grid" />
        </pattern>
      </defs>
      <rect width={FIGURE.width} height={FIGURE.height} fill="url(#scan-grid)" />

      <g className="figure__outline">
        {OUTLINE.map((d, i) => (
          <path key={i} d={d} />
        ))}
        <ellipse cx="150" cy="58" rx="30" ry="36" />
      </g>

      {(Object.keys(ZONE_PATHS) as ZoneId[]).map((id) => (
        <g key={id} className={`zone${lit.has(id) ? " is-lit" : ""}${selected === id ? " is-selected" : ""}`} data-zone={id}>
          {ZONE_PATHS[id].map((d, i) => (
            <path key={i} d={d} />
          ))}
          {id === "core" && <path className="zone__detail" d="M150,190 L150,304 M132,216 L168,216 M132,242 L168,242 M133,270 L167,270" />}
        </g>
      ))}

      <g className="figure__bones">
        <ellipse cx="150" cy="56" rx="24" ry="30" />
        <ellipse cx="140" cy="54" rx="6" ry="5" />
        <ellipse cx="160" cy="54" rx="6" ry="5" />
        <rect x="146" y="122" width="8" height="70" rx="3" />
        {BONES.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {RIBS.map((d, i) => (
          <path key={`r${i}`} d={d} />
        ))}
        {VERTEBRAE.map((y) => (
          <rect key={y} x="145.5" y={y} width="9" height="8" rx="2" />
        ))}
        <circle cx="79" cy="251" r="4" />
        <circle cx="221" cy="251" r="4" />
        <circle cx="121" cy="485" r="6" />
        <circle cx="179" cy="485" r="6" />
      </g>

      {(Object.keys(ZONE_GEOMETRY) as ZoneId[]).map((id) => {
        const g = ZONE_GEOMETRY[id];
        const [fx, fy] = g.label.from;
        const lineEnd = g.label.side === "right" ? g.label.x - 6 : g.label.x + 6;
        return (
          <g key={id} className={`zone-label${lit.has(id) ? " is-lit" : ""}`} aria-hidden="true">
            <path d={`M${fx},${fy} L${lineEnd},${g.label.y - 4}`} />
            <text x={g.label.x} y={g.label.y} textAnchor={g.label.side === "right" ? "start" : "end"}>
              {tags[id]}
            </text>
          </g>
        );
      })}

      <g className="scan-line" data-scan-line>
        <rect x="0" y="-28" width={FIGURE.width} height="28" />
        <line x1="0" y1="0" x2={FIGURE.width} y2="0" />
      </g>
    </svg>
  );
}
