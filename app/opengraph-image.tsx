import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site, hero, offer } from "@/lib/content";

export const alt = `${site.name}: ${hero.headline.join(" ")} A gym in ${site.city}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the Ember tokens in globals.css (Satori cannot read CSS variables).
const COAL = "#0B0B0C";
const BONE = "#F2F0EA";
const EMBER = "#FF4D1A";
const ASH = "#A1A1AA";

export default async function Image() {
  const [font, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/BarlowCondensed-BoldItalic.ttf")),
    readFile(join(process.cwd(), "public", hero.image.src)),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: COAL, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 640,
            height: 630,
            display: "flex",
            overflow: "hidden",
            clipPath: "polygon(205px 0, 640px 0, 435px 630px, 0 630px)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} width={810} height={630} style={{ objectFit: "cover", marginLeft: -85 }} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", width: 640, gap: 24 }}>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 40, color: BONE }}>{site.name.toUpperCase()}</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Barlow Condensed", fontSize: 112, lineHeight: 1, color: BONE }}>
            {hero.headline.map((l) => (
              <span key={l}>{l.toUpperCase()}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                background: EMBER,
                color: COAL,
                fontFamily: "Barlow Condensed",
                fontSize: 30,
                padding: "12px 28px",
                transform: "skewX(-18deg)",
              }}
            >
              {offer.cta.toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: 24, color: ASH }}>{site.city}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Barlow Condensed", data: font, style: "italic", weight: 700 }] },
  );
}
