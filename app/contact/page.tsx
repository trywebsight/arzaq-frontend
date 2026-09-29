import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { OptOutCta } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { ContactSection, FaqSection } from "@/features/contact";
import { fetchProperty } from "@/features/properties/api";
import { buildSeoPageMetadata } from "@/features/seo/merge";
import { prefetchContactQueries } from "@/lib/query/prefetch";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ROUTES, siteConfig } from "@/lib/site";

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

const PROPERTY_SLUG = /^[a-z0-9-]{1,160}$/i;

/**
 * Pre-filled enquiry for `?property=<slug>`, so the office knows which listing
 * the visitor means. Unknown slugs or an unreachable API just leave it empty.
 */
async function propertyEnquiry(
  params: Record<string, string | string[] | undefined>,
  t: Awaited<ReturnType<typeof getTranslations<"ContactPage">>>,
): Promise<string | undefined> {
  const slug = Array.isArray(params.property) ? params.property[0] : params.property;
  if (!slug || !PROPERTY_SLUG.test(slug)) return undefined;

  try {
    const property = await fetchProperty(slug);
    if (!property) return undefined;

    return [
      t("form.propertyEnquiry.intro"),
      property.title,
      property.code ? t("form.propertyEnquiry.code", { code: property.code }) : null,
      `${siteConfig.url}/properties/${property.slug}`,
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return undefined;
  }
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
          <ContactSection initialMessage={await propertyEnquiry(params, tContact)} />
          <FaqSection />
        </main>
      </HydrationBoundary>
    </>
  );
}
