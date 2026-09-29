import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo";
import { fetchProperty } from "@/features/properties/api";
import { PropertyDetail } from "@/features/properties/property-detail";
import { propertyQuery } from "@/features/properties/queries";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import {
  breadcrumbJsonLd,
  ogImagesFromAsset,
  propertyJsonLd,
} from "@/lib/seo";
import { buildSeoPageMetadata } from "@/features/seo/merge";
import { getQueryClient } from "@/lib/query/get-query-client";
import { OG_SIZE } from "@/lib/og";
type PropertyPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Resolve the property for metadata / JSON-LD. `null` means the API answered
 * "not found"; `undefined` means it could not be checked (forced mock state
 * or API unavailable), which must never produce a 404.
 */
async function loadProperty(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  if (!shouldPrefetch(mockStateFromSearchParams(searchParams))) {
    return undefined;
  }
  try {
    return await fetchProperty(slug);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PropertyPageProps): Promise<Metadata> {
  const [{ slug }, search, tMeta] = await Promise.all([
    params,
    searchParams,
    getTranslations("Meta"),
  ]);

  const property = await loadProperty(slug, search);

  // The API answered "not found": render the not-found page (Next adds noindex).
  if (property === null) notFound();

  // Could not check (API unreachable or forced mock state): keep default,
  // indexable metadata so an outage never de-indexes real pages.
  if (property === undefined) {
    return { title: tMeta("siteName") };
  }

  return buildSeoPageMetadata(`properties:${property.slug}`, {
    title: property.title,
    description: property.excerpt,
    path: `/properties/${property.slug}`,
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
    images: ogImagesFromAsset(
      {
        src: `/properties/${property.slug}/opengraph-image`,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: property.title,
        type: "image/png",
      },
      property.title,
    ),
  });
}

/**
 * Property detail route. CTA band stays enabled via SiteShell — do not mount
 * `<OptOutCta />` here.
 */
export default async function PropertyPage({
  params,
  searchParams,
}: PropertyPageProps) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const mockState = mockStateFromSearchParams(search);
  const queryClient = getQueryClient();

  let property = null;

  if (shouldPrefetch(mockState)) {
    property = await fetchProperty(slug);
    if (!property) notFound();
    await queryClient.prefetchQuery(propertyQuery(slug));
  }

  const tNav = property ? await getTranslations("Nav") : null;

  return (
    <>
      {property && tNav ? (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              ...propertyJsonLd(property),
            },
            breadcrumbJsonLd([
              { name: tNav("items.home"), path: "/" },
              { name: tNav("items.properties"), path: "/properties" },
              {
                name: property.title,
                path: `/properties/${property.slug}`,
              },
            ]),
          ]}
        />
      ) : null}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PropertyDetail slug={slug} />
      </HydrationBoundary>
    </>
  );
}
