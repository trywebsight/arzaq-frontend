"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { HapticLink } from "@/components/common";
import { OptOutCta } from "@/components/layout";
import { StatusScreen } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/site";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Segment error UI. Replaces the page inside SiteShell; never surfaces
 * stack traces or digests in production.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <OptOutCta />
      <StatusScreen
        code={t("code")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button type="button" variant="primary" size="pill-lg" onClick={reset}>
              {t("retry")}
            </Button>
            <Button asChild variant="secondary" size="pill-lg">
              <HapticLink href="/" haptics={false}>
                {t("home")}
              </HapticLink>
            </Button>
            <Button asChild variant="outline" size="pill-lg">
              <HapticLink href={ROUTES.contact} haptics={false}>
                {t("contact")}
              </HapticLink>
            </Button>
          </>
        }
      />
    </>
  );
}
