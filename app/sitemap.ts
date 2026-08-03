import type { MetadataRoute } from "next";

import { fetchPosts } from "@/features/blog/api";
import { fetchLegalDocument } from "@/features/legal/api";
import { fetchProperties } from "@/features/properties/api";
import { absoluteUrl } from "@/lib/seo";

/**
 * Native App Router sitemap — static marketing routes plus live property,
 * blog, and legal document dates from the data layer.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let privacyModified = now;
  let termsModified = now;

  try {
    const [privacy, terms] = await Promise.all([
      fetchLegalDocument("privacy"),
      fetchLegalDocument("terms"),
    ]);
    if (privacy?.updatedAt) privacyModified = new Date(privacy.updatedAt);
    if (terms?.updatedAt) termsModified = new Date(terms.updatedAt);
  } catch {
    /* keep `now` */
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/properties"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/team"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/privacy"),
      lastModified: privacyModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: termsModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let propertyEntries: MetadataRoute.Sitemap = [];
  let postEntries: MetadataRoute.Sitemap = [];

  try {
    const properties = await fetchProperties();
    propertyEntries = properties.map((property) => ({
      url: absoluteUrl(`/properties/${property.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    propertyEntries = [];
  }

  try {
    const posts = await fetchPosts();
    postEntries = posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    postEntries = [];
  }

  return [...staticRoutes, ...propertyEntries, ...postEntries];
}
