import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import { LatestArticles } from "@/features/blog/latest-articles";
import {
  AboutSection,
  HeroSection,
  ServicesSection,
} from "@/features/home/sections";
import { fetchProperties } from "@/features/properties/api";
import { FeaturedProperties } from "@/features/properties/featured-properties";
import type { Property } from "@/features/properties/types";
import { TeamSection } from "@/features/team/team-section";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { prefetchHomeQueries } from "@/lib/query/prefetch";
import {
  buildPageMetadata,
  featuredPropertiesItemListJsonLd,
  realEstateAgentJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function featuredForJsonLd(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<Property[]> {
  if (!shouldPrefetch(mockStateFromSearchParams(searchParams))) {
    return [];
  }
  try {
    return await fetchProperties({ featured: true, limit: 3 });
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");

  return {
    ...buildPageMetadata({
      title: t("title"),
      description: t("description"),
      path: "/",
      siteName: t("siteName"),
      ogImageAlt: t("ogImageAlt"),
    }),
    // Default Meta.title already includes the brand — skip the template.
    title: { absolute: t("title") },
  };
}

/**
 * Home page. Prefetch + HydrationBoundary are final.
 * Section order: Hero → About → Properties → Services → Team → Blog.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const [dehydratedState, properties, tMeta, tFooter, tProperties] =
    await Promise.all([
      prefetchHomeQueries(params),
      featuredForJsonLd(params),
      getTranslations("Meta"),
      getTranslations("Footer"),
      getTranslations("Properties"),
    ]);

  return (
    <>
      <JsonLd
        data={[
          realEstateAgentJsonLd({
            name: tMeta("siteName"),
            description: tMeta("description"),
            address: tFooter("contact.address"),
          }),
          webSiteJsonLd({
            name: tMeta("siteName"),
            description: tMeta("description"),
          }),
          featuredPropertiesItemListJsonLd(properties, tProperties("title")),
        ]}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <HeroSection />
          <AboutSection />
          <FeaturedProperties />
          <ServicesSection />
          <TeamSection />
          <LatestArticles />
        </main>
      </HydrationBoundary>
    </>
  );
}
