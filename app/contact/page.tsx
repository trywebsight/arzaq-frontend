import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { OptOutCta } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { ContactSection, FaqSection } from "@/features/contact";
import { buildSeoPageMetadata } from "@/features/seo/merge";
import { prefetchContactQueries } from "@/lib/query/prefetch";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tContact] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("ContactPage"),
  ]);

  return buildSeoPageMetadata("contact", {
    title: tContact("meta.title"),
    description: tContact("meta.description"),
    path: ROUTES.contact,
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

/**
 * Contact Us page. Order: form → FAQ.
 * CTA band is opted out — this page *is* the contact surface.
 */
export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const [dehydratedState, tNav, tContact] = await Promise.all([
    prefetchContactQueries(params),
    getTranslations("Nav"),
    getTranslations("ContactPage"),
  ]);

  return (
    <>
      <OptOutCta />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tContact("meta.title"), path: ROUTES.contact },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <ContactSection />
          <FaqSection />
        </main>
      </HydrationBoundary>
    </>
  );
}
