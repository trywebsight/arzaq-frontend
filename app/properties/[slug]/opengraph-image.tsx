import { ImageResponse } from "next/og";

import ar from "@/messages/ar.json";
import { fetchProperty } from "@/features/properties/api";
import type { PropertyPurpose } from "@/features/properties/types";
import {
  BrandOgFrame,
  loadOgAssets,
  ogImageOptions,
  OG_SIZE,
  resolveOgImageSrc,
} from "@/lib/og";

export const alt = ar.Meta.ogImageAlt;
export const size = OG_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ slug: string }>;
};

function purposeLabel(purpose: PropertyPurpose): string {
  return ar.PropertyDetail.purpose[purpose];
}

/**
 * Branded listing OG — logo, title, purpose / kind / city chips, soft photo.
 */
export default async function PropertyOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const [{ fonts, logoSrc }, property] = await Promise.all([
    loadOgAssets(),
    fetchProperty(slug).catch(() => null),
  ]);

  if (!property) {
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

  const photoSrc = await resolveOgImageSrc(property.image?.src);
  const chips = [
    { label: purposeLabel(property.purpose) },
    { label: property.kindLabel },
    { label: property.city },
  ].filter((chip) => Boolean(chip.label));

  return new ImageResponse(
    (
      <BrandOgFrame
        logoSrc={logoSrc}
        brandName={ar.Meta.siteName}
        title={property.title}
        photoSrc={photoSrc}
        chips={chips}
      />
    ),
    ogImageOptions(fonts),
  );
}
