import type { ImageAsset } from "@/lib/assets";

/**
 * Per-page SEO override from `GET /seo/{pageKey}`.
 * Null or null fields → fall back to messages / entity fields.
 */
export type SeoOverride = {
  title: string | null;
  description: string | null;
  ogImage: ImageAsset | null;
  robots?: { index?: boolean; follow?: boolean } | null;
} | null;

/** GET /seo/{pageKey} */
export type SeoPageKey =
  | "home"
  | "about"
  | "properties"
  | "services"
  | "team"
  | "blog"
  | "contact"
  | "privacy"
  | "terms"
  | (string & {});
