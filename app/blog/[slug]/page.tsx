import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo";
import { fetchPost } from "@/features/blog/api";
import { ArticleDetail } from "@/features/blog/article-detail";
import { latestPostsQuery, postQuery } from "@/features/blog/queries";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  ogImagesFromAsset,
} from "@/lib/seo";
import { buildSeoPageMetadata } from "@/features/seo/merge";
import { getQueryClient } from "@/lib/query/get-query-client";
import { OG_SIZE } from "@/lib/og";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Enough latest posts so related grid can exclude the current slug. */
const RELATED_PREFETCH_LIMIT = 4;

/**
 * Resolve a post for metadata / JSON-LD. Returns `null` when missing or
 * when a forced mock state would fight the hydrate.
 */
async function loadPost(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
) {
  if (!shouldPrefetch(mockStateFromSearchParams(searchParams))) {
    return null;
  }
  try {
    return await fetchPost(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ArticlePageProps): Promise<Metadata> {
  const [{ slug }, search, tMeta, tArticle] = await Promise.all([
    params,
    searchParams,
    getTranslations("Meta"),
    getTranslations("ArticlePage"),
  ]);

  const post = await loadPost(slug, search);

  if (!post) {
    return {
      title: tArticle("meta.notFoundTitle"),
      robots: { index: false, follow: false },
    };
  }

  return buildSeoPageMetadata(`posts:${post.slug}`, {
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    siteName: tMeta("siteName"),
    type: "article",
    publishedTime: post.publishedAt,
    ogImageAlt: tMeta("ogImageAlt"),
    images: ogImagesFromAsset(
      {
        src: `/blog/${post.slug}/opengraph-image`,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: post.title,
        type: "image/png",
      },
      post.title,
    ),
  });
}

/**
 * Blog article detail route. CTA band stays enabled via SiteShell — do not
 * mount `<OptOutCta />` here.
 */
export default async function ArticlePage({
  params,
  searchParams,
}: ArticlePageProps) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const mockState = mockStateFromSearchParams(search);
  const queryClient = getQueryClient();

  let post = null;

  if (shouldPrefetch(mockState)) {
    post = await fetchPost(slug);
    if (!post) notFound();
    await Promise.all([
      queryClient.prefetchQuery(postQuery(slug)),
      queryClient.prefetchQuery(latestPostsQuery(RELATED_PREFETCH_LIMIT)),
    ]);
  }

  const [tMeta, tNav] = post
    ? await Promise.all([getTranslations("Meta"), getTranslations("Nav")])
    : [null, null];

  return (
    <>
      {post && tMeta && tNav ? (
        <JsonLd
          data={[
            articleJsonLd(post, tMeta("siteName")),
            breadcrumbJsonLd([
              { name: tNav("items.home"), path: "/" },
              { name: tNav("items.blog"), path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]}
        />
      ) : null}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArticleDetail slug={slug} />
      </HydrationBoundary>
    </>
  );
}
