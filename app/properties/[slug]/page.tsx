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
 * Resolve a listing for metadata / JSON-LD. Returns `null` when missing or
 * when a forced mock state would fight the hydrate.
 */
async function loadProperty(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  if (!shouldPrefetch(mockStateFromSearchParams(searchParams))) {
    return null;
  }
  try {
    return await fetchProperty(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PropertyPageProps): Promise<Metadata> {
  const [{ slug }, search, tMeta, tDetail] = await Promise.all([
    params,
    searchParams,
    getTranslations("Meta"),
    getTranslations("PropertyDetail"),
  ]);

  const property = await loadProperty(slug, search);

  if (!property) {
    return {
      title: tDetail("meta.notFoundTitle"),
      robots: { index: false, follow: false },
    };
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
