import type { Metadata } from "next";
import { connection } from "next/server";

import type { Post } from "@/features/blog/types";
import type { Property } from "@/features/properties/types";
import { readingMinutesFromSections } from "@/lib/reading-time";
import { CONTACT, SOCIAL_LINKS, siteConfig } from "@/lib/site";

/** Join `siteConfig.url` with a path, normalising slashes. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix === "/" ? "" : suffix}` || base;
}

export type RealEstateAgentInput = {
  name: string;
  description: string;
  /** Street address from Footer.contact.address or settings. */
  address: string;
  email?: string;
  telephone?: string;
  sameAs?: readonly string[];
};

/**
 * Schema.org `RealEstateAgent` (a subtype of `LocalBusiness` / `Organization`).
 * Mount once on the homepage — do not duplicate on every marketing page.
 */
export function realEstateAgentJsonLd(input: RealEstateAgentInput) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${absoluteUrl()}/#organization`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(),
    email: input.email ?? CONTACT.email,
    telephone: input.telephone ?? CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address,
      addressCountry: "KW",
      addressLocality: "Kuwait City",
    },
    areaServed: {
      "@type": "Country",
      name: "Kuwait",
    },
    sameAs: [...(input.sameAs ?? SOCIAL_LINKS.map((link) => link.href))],
  };
}

/**
 * Schema.org `WebSite` linked to the organisation. Mount with the agent
 * schema on the homepage only.
 */
export function webSiteJsonLd(input: { name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl()}/#website`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(),
    inLanguage: siteConfig.locale,
    publisher: {
      "@id": `${absoluteUrl()}/#organization`,
    },
  };
}

export type BreadcrumbItem = {
  /** Visible / schema name (Arabic from messages). */
  name: string;
  /** Site-relative path, e.g. `/properties`. */
  path: string;
};

/**
 * Schema.org `BreadcrumbList` for listing and detail pages.
 *
 * @example
 * breadcrumbJsonLd([
 *   { name: tNav("items.home"), path: "/" },
 *   { name: tNav("items.properties"), path: "/properties" },
 * ])
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Schema.org `ItemList` of featured listings as `Residence` + `Offer`.
 * Safe to omit when the list is empty.
 *
 * @param listName - Localised list title (e.g. `Properties.title`).
 */
export function featuredPropertiesItemListJsonLd(
  properties: Property[],
  listName: string,
) {
  if (properties.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl()}/#featured-properties`,
    name: listName,
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: propertyJsonLd(property),
    })),
  };
}

/**
 * Schema.org `Residence` with an optional `Offer` for a single listing.
 * Nest inside an `ItemList` or wrap with `@context` on the detail page.
 */
export function propertyJsonLd(property: Property) {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const galleryImages = (property.gallery ?? []).map((asset) =>
    absoluteUrl(asset.src),
  );
  const primarySrc = property.image?.src
    ? absoluteUrl(property.image.src)
    : undefined;
  const images = primarySrc
    ? [primarySrc, ...galleryImages]
    : galleryImages;

  const residence = {
    "@type": "Residence" as const,
    "@id": `${url}#residence`,
    name: property.title,
    description: property.excerpt,
    url,
    address: {
      "@type": "PostalAddress" as const,
      streetAddress: property.address,
      addressLocality: property.district || property.city,
      addressRegion: property.city,
      addressCountry: "KW",
    },
    floorSize:
      property.area > 0
        ? {
            "@type": "QuantitativeValue" as const,
            value: property.area,
            unitCode: "MTK",
          }
        : undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    numberOfBathroomsTotal: property.bathrooms ?? undefined,
    image: images.length === 0 ? undefined : images.length === 1 ? images[0] : images,
  };

  if (property.price === null) {
    return residence;
  }

  return {
    ...residence,
    offers: {
      "@type": "Offer" as const,
      price: property.price,
      priceCurrency: "KWD",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

/**
 * Schema.org `BlogPosting` for `/blog/[slug]`.
 *
 * @param publisherName - Localised org name (e.g. `Meta.siteName`).
 * @example
 * <JsonLd data={articleJsonLd(post, t("siteName"))} />
 */
export function articleJsonLd(post: Post, publisherName: string) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt,
    image: post.image?.src ? absoluteUrl(post.image.src) : undefined,
    articleSection: post.category,
    inLanguage: siteConfig.locale,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: absoluteUrl(),
    },
    timeRequired: `PT${readingMinutesFromSections(post)}M`,
  };
}

/**
 * Crawler-facing brand OG card path (`.png` suffix — WhatsApp/Slack prefer it).
 * Rewritten to the App Router `opengraph-image` generator in `next.config.ts`.
 */
export const DEFAULT_OG_IMAGE_PATH = "/og.png" as const;

export type OgImageInput = {
  /** Site-relative path or absolute URL. */
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
};

/**
 * Normalise a listing/cover (or brand) image into Metadata `openGraph.images`.
 * Always emits an absolute URL so scrapers do not depend on relative resolution.
 */
export function ogImagesFromAsset(
  image: OgImageInput,
  fallbackAlt = "",
): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  return [
    {
      url: absoluteUrl(image.src),
      ...(image.width ? { width: image.width } : { width: 1200 }),
      ...(image.height ? { height: image.height } : { height: 630 }),
      alt: image.alt || fallbackAlt,
      ...(image.type ? { type: image.type } : {}),
    },
  ];
}

/**
 * Default brand Open Graph / Twitter card (`/og.png` → `/opengraph-image`).
 *
 * @param alt - Localised alt from `Meta.ogImageAlt`.
 */
export function defaultOgImages(
  alt: string,
): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  return ogImagesFromAsset(
    {
      src: DEFAULT_OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt,
      type: "image/png",
    },
    alt,
  );
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. `/about`. */
  path: string;
  siteName: string;
  type?: "website" | "article";
  /**
   * OG/Twitter images. When omitted, the brand `/og.png` card is used.
   * Pass `false` to omit images from metadata so a segment-level
   * `opengraph-image` file convention can supply the card instead.
   */
  images?:
    | (NonNullable<Metadata["openGraph"]> extends { images?: infer I }
        ? I
        : never)
    | false;
  /** Alt text for the default brand OG image when `images` is omitted. */
  ogImageAlt?: string;
  publishedTime?: string;
  robots?: Metadata["robots"];
};

function twitterImageUrls(
  images: Exclude<NonNullable<PageMetadataInput["images"]>, false>,
): string[] {
  if (typeof images === "string") return [images];
  if (images instanceof URL) return [images.href];
  if (!Array.isArray(images)) {
    if (typeof images === "object" && images !== null && "url" in images) {
      const url = images.url;
      return [typeof url === "string" ? url : url.href];
    }
    return [String(images)];
  }
  return images.map((image) => {
    if (typeof image === "string") return image;
    if (image instanceof URL) return image.href;
    if (typeof image === "object" && image !== null && "url" in image) {
      const url = image.url;
      return typeof url === "string" ? url : url.href;
    }
    return String(image);
  });
}

/**
 * Shared Metadata API shape for static marketing pages and dynamic details.
 *
 * Resolves at request time so container `SITE_URL` overrides bake into
 * `og:image` without rebuilding the image.
 *
 * @example
 * return buildPageMetadata({
 *   title,
 *   description,
 *   path: "/about",
 *   siteName: tMeta("siteName"),
 *   ogImageAlt: tMeta("ogImageAlt"),
 * });
 */
export async function buildPageMetadata(
  input: PageMetadataInput,
): Promise<Metadata> {
  await connection();
  const url = absoluteUrl(input.path);
  const ogType = input.type ?? "website";
  const images =
    input.images === false
      ? undefined
      : (input.images ??
        defaultOgImages(input.ogImageAlt ?? input.siteName));
  const twitterImages = images ? twitterImageUrls(images) : undefined;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    ...(input.robots ? { robots: input.robots } : {}),
    openGraph: {
      type: ogType,
      locale: siteConfig.ogLocale,
      siteName: input.siteName,
      title: input.title,
      description: input.description,
      url,
      ...(images ? { images } : {}),
      ...(input.publishedTime && ogType === "article"
        ? { publishedTime: input.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      ...(twitterImages ? { images: twitterImages } : {}),
    },
  };
}
