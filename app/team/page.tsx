import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import { TeamListing } from "@/features/team/team-listing";
import { prefetchTeamQueries } from "@/lib/query/prefetch";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

type TeamPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");

  return buildPageMetadata({
    title: t("team.title"),
    description: t("team.description"),
    path: "/team",
    siteName: t("siteName"),
    ogImageAlt: t("ogImageAlt"),
  });
}

/**
 * Team listing page — static 3-column grid of all members.
 * CTA band comes from SiteShell; do not mount OptOutCta.
 */
export default async function TeamPage({ searchParams }: TeamPageProps) {
  const params = await searchParams;
  const [dehydratedState, tNav] = await Promise.all([
    prefetchTeamQueries(params),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tNav("items.team"), path: "/team" },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <TeamListing />
        </main>
      </HydrationBoundary>
    </>
  );
}
