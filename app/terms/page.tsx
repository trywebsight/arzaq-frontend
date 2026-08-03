import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import { TermsContent } from "@/features/terms";
import { fetchLegalDocument } from "@/features/legal/api";
import { legalDocumentQuery } from "@/features/legal/queries";
import { getQueryClient } from "@/lib/query/get-query-client";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tLegal, doc] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("LegalPage"),
    fetchLegalDocument("terms"),
  ]);

  return buildPageMetadata({
    title: doc?.metaTitle || doc?.title || tLegal("terms.meta.title"),
    description: doc?.metaDescription || tLegal("terms.meta.description"),
    path: "/terms",
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

/**
 * Terms of Service. CTA band comes from SiteShell after children —
 * do not mount `<OptOutCta />` on this route.
 * Body content: `GET /legal/terms` (mocks until API live).
 */
export default async function TermsPage() {
  const queryClient = getQueryClient();
  const [tNav, tLegal, doc] = await Promise.all([
    getTranslations("Nav"),
    getTranslations("LegalPage"),
    fetchLegalDocument("terms"),
  ]);

  queryClient.setQueryData(legalDocumentQuery("terms").queryKey, doc);

  const crumbTitle =
    doc?.metaTitle || doc?.title || tLegal("terms.meta.title");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: crumbTitle, path: "/terms" },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <TermsContent />
        </main>
      </HydrationBoundary>
    </>
  );
}
