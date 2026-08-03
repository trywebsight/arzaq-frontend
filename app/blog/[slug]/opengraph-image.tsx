import { ImageResponse } from "next/og";

import ar from "@/messages/ar.json";
import { fetchPost } from "@/features/blog/api";
import {
  BrandOgFrame,
  loadOgAssets,
  ogImageOptions,
  OG_SIZE,
  resolveOgImageSrc,
} from "@/lib/og";
import { readingMinutesFromSections } from "@/lib/reading-time";

export const alt = ar.Meta.ogImageAlt;
export const size = OG_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Branded article OG — logo, title, category, computed reading time, soft cover.
 */
export default async function ArticleOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const [{ fonts, logoSrc }, post] = await Promise.all([
    loadOgAssets(),
    fetchPost(slug).catch(() => null),
  ]);

  if (!post) {
    return new ImageResponse(
      (
        <BrandOgFrame
          logoSrc={logoSrc}
          brandName={ar.Meta.siteName}
          title={ar.Meta.siteName}
          subtitle={ar.Meta.shortDescription}
        />
      ),
      ogImageOptions(fonts),
    );
  }

  const minutes = readingMinutesFromSections(post);
  const readingLabel = ar.Blog.card.readingTime.replace(
    "{minutes}",
    String(minutes),
  );
  const photoSrc = await resolveOgImageSrc(post.image?.src);

  return new ImageResponse(
    (
      <BrandOgFrame
        logoSrc={logoSrc}
        brandName={ar.Meta.siteName}
        title={post.title}
        photoSrc={photoSrc}
        chips={[
          { label: post.category },
          { label: readingLabel },
        ]}
      />
    ),
    ogImageOptions(fonts),
  );
}
