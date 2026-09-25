import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(180deg, #faf4ec 0%, #f8e0cd 70%, #f1c7aa 100%)",
          color: "#2d231e",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 90,
            bottom: 150,
            width: 300,
            height: 150,
            borderTopLeftRadius: 150,
            borderTopRightRadius: 150,
            background: "#bd6847",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 150,
            background: "#7d8c6f",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#8b452f" }}>
          McALLEN, TEXAS · ENGLISH &amp; SPANISH
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760, marginBottom: 150 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 36, marginTop: 24, color: "#4d3f38" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
