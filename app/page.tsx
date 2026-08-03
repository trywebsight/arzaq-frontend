import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import { HomePageContent } from "@/features/home/home-page-content";
import { fetchProperties } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { buildSeoPageMetadata } from "@/features/seo/merge";
import {
  resolveContact,
  resolveHomeLimits,
  resolveSocials,
} from "@/features/settings/merge";
import { getHomeContent, getSiteSettings } from "@/features/settings/server";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { prefetchHomeQueries } from "@/lib/query/prefetch";
import {
  featuredPropertiesItemListJsonLd,
  realEstateAgentJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function featuredForJsonLd(
  searchParams: Record<string, string | string[] | undefined>,
  limit: number,
): Promise<Property[]> {
  if (!shouldPrefetch(mockStateFromSearchParams(searchParams))) {
    return [];
  }
  try {
    return await fetchProperties({ featured: true, limit });
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  const meta = await buildSeoPageMetadata("home", {
    title: t("title"),
    description: t("description"),
    path: "/",
    siteName: t("siteName"),
    ogImageAlt: t("ogImageAlt"),
  });
  const absoluteTitle =
    typeof meta.title === "string" ? meta.title : t("title");

  return {
    ...meta,
    // Default Meta.title already includes the brand — skip the template.
    title: { absolute: absoluteTitle },
  };
}

/**
 * Home page. Prefetch + HydrationBoundary are final.
 * Section order: Hero → About → Properties → Services → Team → Blog.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const [dehydratedState, settings, home, tMeta, tFooter, tProperties] =
    await Promise.all([
      prefetchHomeQueries(params),
      getSiteSettings(),
      getHomeContent(),
      getTranslations("Meta"),
      getTranslations("Footer"),
      getTranslations("Properties"),
    ]);

  const limits = resolveHomeLimits(home);
  const contact = resolveContact(settings);
  const socials = resolveSocials(settings);
  const address = contact.address?.trim() || tFooter("contact.address");
  const properties = await featuredForJsonLd(
    params,
    limits.featuredPropertyLimit,
  );

  return (
    <>
      <JsonLd
        data={[
          realEstateAgentJsonLd({
            name: tMeta("siteName"),
            description: tMeta("description"),
            address,
            email: contact.email,
            telephone: contact.phone,
            sameAs: socials.map((link) => link.href),
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
          <HomePageContent />
        </main>
      </HydrationBoundary>
    </>
  );
}
