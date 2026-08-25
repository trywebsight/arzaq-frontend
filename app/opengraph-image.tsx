import { ImageResponse } from "next/og";

import ar from "@/messages/ar.json";
import {
  BrandOgFrame,
  loadOgAssets,
  ogImageOptions,
  OG_SIZE,
} from "@/lib/og";

export const alt = ar.Meta.ogImageAlt;
export const size = OG_SIZE;
export const contentType = "image/png";
/** Runtime so `DEMO_MODE` can swap the mark without a rebuild. */
export const dynamic = "force-dynamic";

/**
 * Default brand Open Graph card — logo, site name, tagline.
 * Served at `/opengraph-image` and (via rewrite) `/og.png`.
 *
 * Arabic tokens are reversed for Satori via `satoriRtlText` — do not set CSS
 * `direction: rtl` inside ImageResponse (word layout stays LTR after shaping).
 */
export default async function OpenGraphImage() {
  const { fonts, logoSrc } = await loadOgAssets();

  return new ImageResponse(
    (
      <BrandOgFrame
        logoSrc={logoSrc}
        brandName={ar.Meta.siteName}
        title={ar.Meta.siteName}
        subtitle={ar.Meta.shortDescription}
      />
    ),
    ogImageOptions(fonts),
  );
}
