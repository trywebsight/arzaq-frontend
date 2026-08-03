"use client";

import { useEffect } from "react";
import Link from "next/link";

import "./globals.css";

import { StatusScreen } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { direction, htmlLang } from "@/i18n/request";
import { fontVariables } from "@/lib/fonts";
import { ROUTES } from "@/lib/site";
import ar from "@/messages/ar.json";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root-layout failure boundary. Must render its own `<html>` / `<body>` with
 * `lang="ar"` and `dir="rtl"`. Copy is read from messages directly because
 * next-intl providers may be unavailable.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = ar.ErrorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang={htmlLang}
      dir={direction}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-ink">
        <StatusScreen
          code={t.code}
          title={t.title}
          description={t.description}
          className="min-h-full"
          actions={
            <>
              <Button
                type="button"
                variant="primary"
                size="pill-lg"
                onClick={reset}
              >
                {t.retry}
              </Button>
              <Button asChild variant="secondary" size="pill-lg">
                <Link href="/">{t.home}</Link>
              </Button>
              <Button asChild variant="outline" size="pill-lg">
                <Link href={ROUTES.contact}>{t.contact}</Link>
              </Button>
            </>
          }
        />
      </body>
    </html>
  );
}
