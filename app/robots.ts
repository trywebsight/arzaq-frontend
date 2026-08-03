import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

/**
 * Native App Router robots.txt. Points crawlers at the generated sitemap.
 * All public marketing routes are indexable; API / internal paths are not
 * exposed as App Router routes today.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
