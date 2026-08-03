import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import "./globals.css";
// Resolves every <BoneSkeleton> to its captured bones. No-op until
// `pnpm exec boneyard-js build` has run against the finished UI.
import "@/bones/registry";

import { direction, htmlLang } from "@/i18n/request";
import { fontVariables } from "@/lib/fonts";
import {
  DEFAULT_OG_IMAGE_PATH,
  absoluteUrl,
  defaultOgImages,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Providers } from "@/app/providers";
import { SiteShell } from "@/components/layout/site-shell";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const t = await getTranslations("Meta");
  const ogAlt = t("ogImageAlt");
  const ogImages = defaultOgImages(ogAlt);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    applicationName: t("siteName"),
    // File conventions also emit these (`app/favicon.ico`, `icon.png`,
    // `apple-icon.png`); keep explicit entries so crawlers always see them.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.ogLocale,
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={htmlLang}
      dir={direction}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-ink">
        <NextIntlClientProvider>
          <Providers>
            <SiteShell>{children}</SiteShell>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
