import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card: the practice logo on the site's cream background.
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-full.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(135deg, #fdfaf6 0%, #faf4ec 55%, #f5e3d4 100%)",
          color: "#2d231e",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={logoSrc} width={460} height={403} alt="" />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 520 }}>
          <div style={{ fontSize: 52, lineHeight: 1.15 }}>{site.tagline}</div>
          <div style={{ display: "flex", marginTop: 28, height: 3, width: 90, background: "#bd6847" }} />
          <div style={{ fontSize: 28, marginTop: 28, color: "#5f5048", lineHeight: 1.4 }}>
            Counseling in English &amp; Spanish · McAllen, Texas &amp; Telehealth
          </div>
        </div>
      </div>
    ),
    size,
  );
}
