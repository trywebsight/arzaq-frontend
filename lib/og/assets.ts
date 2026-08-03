import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { assets } from "@/lib/assets";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_COLORS = {
  primary: "#00ade9",
  primaryDeep: "#008fc4",
  ink: "#231f20",
  white: "#ffffff",
  whiteMuted: "rgba(255,255,255,0.92)",
  overlay: "rgba(0, 35, 48, 0.72)",
  chipBg: "rgba(255,255,255,0.16)",
  logoPlate: "#ffffff",
} as const;

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 600 | 700;
};

export type OgAssets = {
  fonts: OgFont[];
  logoSrc: string;
};

let cached: Promise<OgAssets> | null = null;

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

/**
 * Load Cairo TTFs and the stacked logo once per process for OG generators.
 */
export function loadOgAssets(): Promise<OgAssets> {
  if (!cached) {
    cached = (async () => {
      const [bold, semibold, logoBuffer] = await Promise.all([
        readFile(join(process.cwd(), "assets/fonts/Cairo-Bold.ttf")),
        readFile(join(process.cwd(), "assets/fonts/Cairo-SemiBold.ttf")),
        readFile(
          join(process.cwd(), "public", assets.logoStacked.src.slice(1)),
        ),
      ]);

      return {
        fonts: [
          {
            name: "Cairo",
            data: toArrayBuffer(bold),
            style: "normal",
            weight: 700,
          },
          {
            name: "Cairo",
            data: toArrayBuffer(semibold),
            style: "normal",
            weight: 600,
          },
        ],
        logoSrc: `data:image/png;base64,${logoBuffer.toString("base64")}`,
      };
    })();
  }
  return cached;
}

/**
 * Resolve a public path or remote URL for use inside `ImageResponse`.
 * Local `/public` files become data URLs; absolute http(s) URLs pass through.
 *
 * @param src - Root-relative public path or absolute URL.
 */
export async function resolveOgImageSrc(
  src: string | null | undefined,
): Promise<string | null> {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;

  const relative = src.replace(/^\//, "");
  try {
    const buffer = await readFile(join(process.cwd(), "public", relative));
    const ext = relative.split(".").pop()?.toLowerCase();
    const mime =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
          ? "image/webp"
          : "image/png";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
