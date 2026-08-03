import { dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/seo";
import { BlogListing } from "@/features/blog/blog-listing";
import { postsQuery } from "@/features/blog/queries";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { getQueryClient } from "@/lib/query/get-query-client";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildSeoPageMetadata } from "@/features/seo/merge";

type BlogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const [tMeta, tBlog] = await Promise.all([
    getTranslations("Meta"),
    getTranslations("BlogPage"),
  ]);

  return buildSeoPageMetadata("blog", {
    title: tBlog("meta.title"),
    description: tBlog("meta.description"),
    path: "/blog",
    siteName: tMeta("siteName"),
    ogImageAlt: tMeta("ogImageAlt"),
  });
}

async function prefetchBlogListing(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(postsQuery());
  }

  return dehydrate(queryClient);
}

/**
 * Blog listing page — 3-column article grid.
 * CTA band comes from SiteShell; do not mount OptOutCta.
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const [dehydratedState, tNav] = await Promise.all([
    prefetchBlogListing(params),
    getTranslations("Nav"),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("items.home"), path: "/" },
          { name: tNav("items.blog"), path: "/blog" },
        ])}
      />
      <HydrationBoundary state={dehydratedState}>
        <main id="main" className="flex-1" tabIndex={-1}>
          <BlogListing />
        </main>
      </HydrationBoundary>
    </>
  );
}
