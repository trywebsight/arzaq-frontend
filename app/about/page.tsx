import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import {
  AboutIntroSection,
  AboutMissionSection,
  AboutObjectivesSection,
  AboutVisionSection,
} from "@/features/about";
import { TeamSection } from "@/features/team/team-section";
import { prefetchAboutQueries } from "@/lib/query/prefetch";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildSeoPageMetadata } from "@/features/seo/merge";

type AboutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tAbout] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("AboutPage"),
  ]);

  return buildSeoPageMetadata("about", {
    title: tAbout("meta.title"),
    description: tAbout("meta.description"),
    path: "/about",
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

/**
 * About Us page. Order: Intro → Vision → Mission → Objectives → Team.
 * CTA band comes from SiteShell after children.
 */
export default async function AboutPage({ searchParams }: AboutPageProps) {
  const params = await searchParams;
  const [dehydratedState, tNav] = await Promise.all([
    prefetchAboutQueries(params),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tNav("items.about"), path: "/about" },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <AboutIntroSection />
          <AboutVisionSection />
          <AboutMissionSection />
          <AboutObjectivesSection />
          <TeamSection />
        </main>
      </HydrationBoundary>
    </>
  );
}
