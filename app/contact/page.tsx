import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { OptOutCta } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { ContactSection, FaqSection } from "@/features/contact";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tContact] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("ContactPage"),
  ]);

  return buildPageMetadata({
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
export default async function ContactPage() {
  const [tNav, tContact] = await Promise.all([
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
      <main id="main" className="flex-1" tabIndex={-1}>
        <ContactSection />
        <FaqSection />
      </main>
    </>
  );
}
