import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { OptOutCta } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { PrivacySection } from "@/features/privacy";
import { fetchLegalDocumentSafe } from "@/features/legal/api";
import { legalDocumentQuery } from "@/features/legal/queries";
import { getQueryClient } from "@/lib/query/get-query-client";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildSeoPageMetadata } from "@/features/seo/merge";

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tLegal, doc] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("LegalPage"),
    fetchLegalDocumentSafe("privacy"),
  ]);

  return buildSeoPageMetadata("privacy", {
    title: doc?.metaTitle || doc?.title || tLegal("privacy.meta.title"),
    description:
      doc?.metaDescription || tLegal("privacy.meta.description"),
    path: "/privacy",
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

/**
 * Privacy Policy. CTA band is opted out — legal pages stay quiet.
 * Body content: `GET /legal/privacy` (mocks until API live).
 */
export default async function PrivacyPage() {
  const queryClient = getQueryClient();
  const [tNav, tLegal, doc] = await Promise.all([
    getTranslations("Nav"),
    getTranslations("LegalPage"),
    fetchLegalDocumentSafe("privacy"),
  ]);

  queryClient.setQueryData(legalDocumentQuery("privacy").queryKey, doc);

  const crumbTitle =
    doc?.metaTitle || doc?.title || tLegal("privacy.meta.title");

  return (
    <>
      <OptOutCta />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: crumbTitle, path: "/privacy" },
        ])}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <PrivacySection />
        </main>
      </HydrationBoundary>
    </>
  );
}
