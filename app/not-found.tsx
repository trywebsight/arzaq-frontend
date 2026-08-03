import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { HapticLink } from "@/components/common";
import { OptOutCta } from "@/components/layout";
import { StatusScreen } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");

  return {
    title: t("meta.title"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * Global 404. Root layout still wraps this with SiteShell (nav + footer).
 * CTA band is opted out — the page is intentionally minimal.
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <OptOutCta />
      <StatusScreen
        code={t("code")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button asChild variant="primary" size="pill-lg">
              <HapticLink href="/" haptics={false}>
                {t("cta")}
              </HapticLink>
            </Button>
            <Button asChild variant="secondary" size="pill-lg">
              <HapticLink href={ROUTES.contact} haptics={false}>
                {t("contactCta")}
              </HapticLink>
            </Button>
          </>
        }
      />
    </>
  );
}
