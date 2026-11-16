import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Ember tokens (Satori cannot read CSS variables): the slanted button, as a favicon.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0B0C" }}>
        <div style={{ width: 40, height: 44, background: "#FF4D1A", transform: "skewX(-18deg)" }} />
      </div>
    ),
    size,
  );
}
