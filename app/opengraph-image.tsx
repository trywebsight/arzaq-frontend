import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import ar from "@/messages/ar.json";
import { assets } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

export const alt = ar.Meta.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated Open Graph image — brand blue field, logo mark, site name, tagline.
 * Served at `/opengraph-image` and picked up automatically by the Metadata API.
 *
 * Fonts are static Cairo TTFs under `assets/fonts/` (instanced from the
 * upstream variable font). Satori cannot consume WOFF2 or most variable fonts.
 */
export default async function OpenGraphImage() {
  const siteName = ar.Meta.siteName;
  const tagline = ar.Meta.shortDescription;

  const [bold, semibold, logoBuffer] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Cairo-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Cairo-SemiBold.ttf")),
    readFile(join(process.cwd(), "public", assets.logoStacked.src.slice(1))),
  ]);

  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(145deg, #00ADE9 0%, #008fc4 55%, #231F20 160%)",
          color: "#ffffff",
          fontFamily: "Cairo",
          direction: siteConfig.direction,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 20,
              background: "#ffffff",
              padding: 10,
            }}
          >
            <img
              src={logoSrc}
              width={76}
              height={76}
              alt=""
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 0,
              opacity: 0.95,
            }}
          >
            {siteName}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: 0,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.45,
              opacity: 0.92,
              maxWidth: 860,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            opacity: 0.8,
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cairo", data: bold, style: "normal", weight: 700 },
        { name: "Cairo", data: semibold, style: "normal", weight: 600 },
      ],
    },
  );
}
