"use client";

import { useTranslations } from "next-intl";

import { ArticleCard } from "@/features/blog/article-card";
import { usePosts } from "@/features/blog/hooks";
import { BlogGridSkeleton } from "@/features/blog/skeletons";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { StaggerGroup } from "@/components/motion";

/** Page size for the listing grid. Pagination can wrap this later. */
export const BLOG_PAGE_SIZE = 6;

/**
 * Blog index listing — eyebrow, title and a responsive ArticleCard grid.
 *
 * @example
 * <BlogListing />
 */
export function BlogListing() {
  const t = useTranslations("BlogPage");
  const tBlog = useTranslations("Blog");
  const query = usePosts();
  const titleId = "blog-listing-title";

  return (
    <Section aria-labelledby={titleId} spacing="default">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleAs="h1"
        titleId={titleId}
        layout="stacked"
      />

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          emptyTitle={tBlog("empty.title")}
          emptyDescription={tBlog("empty.description")}
          skeleton={
            <BoneSkeleton
              name="blog-listing-grid"
              loading
              fallback={<BlogGridSkeleton />}
            >
              <BlogGridSkeleton />
            </BoneSkeleton>
          }
        >
          {(posts) => (
            <StaggerGroup
              className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3"
              stagger={0.1}
            >
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} className="h-full" />
              ))}
            </StaggerGroup>
          )}
        </QueryState>
      </div>
    </Section>
  );
}
