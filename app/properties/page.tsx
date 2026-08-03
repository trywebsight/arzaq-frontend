import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import {
  listingToPropertyFilters,
  parseListingParams,
} from "@/features/properties/listing-params";
import { PropertiesListing } from "@/features/properties/properties-listing";
import { propertiesQuery } from "@/features/properties/queries";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { getQueryClient } from "@/lib/query/get-query-client";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type PropertiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");

  return buildPageMetadata({
    title: t("properties.title"),
    description: t("properties.description"),
    path: "/properties",
    siteName: t("siteName"),
    ogImageAlt: t("ogImageAlt"),
  });
}

async function prefetchPropertiesListing(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);
  const listing = parseListingParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(
      propertiesQuery(listingToPropertyFilters(listing)),
    );
  }

  return { dehydratedState: dehydrate(queryClient), listing };
}

/**
 * Properties listing page — filterable grid with URL-driven pagination.
 * CTA band comes from SiteShell; do not mount OptOutCta.
 */
export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const [{ dehydratedState, listing }, tNav] = await Promise.all([
    prefetchPropertiesListing(params),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tNav("items.properties"), path: "/properties" },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <PropertiesListing params={listing} />
        </main>
      </HydrationBoundary>
    </>
  );
}
