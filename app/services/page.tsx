import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import {
  BuyersSection,
  SellersSection,
  ServicesIntroSection,
} from "@/features/services";
import { prefetchServicesQueries } from "@/lib/query/prefetch";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type ServicesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tPage] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("ServicesPage"),
  ]);

  return buildPageMetadata({
    title: tPage("meta.title"),
    description: tPage("meta.description"),
    path: "/services",
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

/**
 * Services listing page. Order: Intro list → Sellers → Buyers.
 * CTA band comes from SiteShell after children — do not mount OptOutCta.
 */
export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const [dehydratedState, tNav] = await Promise.all([
    prefetchServicesQueries(params),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tNav("items.services"), path: "/services" },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <ServicesIntroSection />
          <SellersSection />
          <BuyersSection />
        </main>
      </HydrationBoundary>
    </>
  );
}
