import type { Metadata } from "next";

import { fetchSeoOverride } from "@/features/seo/api";
import type { SeoOverride, SeoPageKey } from "@/features/seo/types";
import {
  buildPageMetadata,
  ogImagesFromAsset,
  type PageMetadataInput,
} from "@/lib/seo";

/**
 * Merge a CMS SEO override over message/entity fallbacks.
 * Null override or null fields keep the fallback value.
 *
 * @example
 * mergeSeoOverride(override, { title: t("title"), description: t("description"), ... })
 */
export function mergeSeoOverride(
  override: SeoOverride,
  fallback: PageMetadataInput,
): PageMetadataInput {
  if (!override) return fallback;

  const title = override.title?.trim() || fallback.title;
  const description = override.description?.trim() || fallback.description;

  let images = fallback.images;
  if (override.ogImage?.src) {
    images = ogImagesFromAsset(
      override.ogImage,
      override.ogImage.alt || fallback.ogImageAlt || title,
    );
  }

  let robots = fallback.robots;
  if (override.robots) {
    robots = {
      index: override.robots.index ?? true,
      follow: override.robots.follow ?? true,
    };
  }

  return {
    ...fallback,
    title,
    description,
    ...(images !== undefined ? { images } : {}),
    ...(robots !== undefined ? { robots } : {}),
  };
}

/**
 * Fetch `GET /seo/{pageKey}` and merge into `buildPageMetadata`.
 * Network / empty failures keep the message fallbacks.
 *
 * @example
 * return buildSeoPageMetadata("about", {
 *   title: tAbout("meta.title"),
 *   description: tAbout("meta.description"),
 *   path: "/about",
 *   siteName: tMeta("siteName"),
 *   ogImageAlt: tMeta("ogImageAlt"),
 * });
 */
export async function buildSeoPageMetadata(
  pageKey: SeoPageKey,
  fallback: PageMetadataInput,
): Promise<Metadata> {
  let override: SeoOverride = null;
  try {
    override = await fetchSeoOverride(pageKey);
  } catch {
    override = null;
  }

  return buildPageMetadata(mergeSeoOverride(override, fallback));
}
