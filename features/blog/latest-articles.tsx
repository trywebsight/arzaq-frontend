"use client";

import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/site";
import { useLatestPosts } from "@/features/blog/hooks";
import { ArticleCard } from "@/features/blog/article-card";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { HapticLink } from "@/components/common/haptic-link";
import { StaggerGroup } from "@/components/motion";
import { Button } from "@/components/ui/button";

export type LatestArticlesProps = {
  /** Max posts to show. @default 3 */
  limit?: number;
  className?: string;
};

function ArticleGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-card border border-border"
        >
          <div className="aspect-16/10 w-full animate-pulse bg-muted" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-auto h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Home-page latest articles section — header, QueryState grid and
 * staggered ArticleCards.
 *
 * @param limit - Cap on posts. Defaults to 3.
 * @example
 * <LatestArticles />
 */
export function LatestArticles({ limit = 3, className }: LatestArticlesProps) {
  const t = useTranslations("Blog");
  const query = useLatestPosts(limit);
  const titleId = "latest-articles-title";

  return (
    <Section
      id={SECTION_IDS.blog}
      aria-labelledby={titleId}
      className={className}
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId={titleId}
        action={
          <Button asChild variant="primary" size="pill-lg">
            <HapticLink href="/blog" haptics={false}>
              {t("cta")}
            </HapticLink>
          </Button>
        }
      />

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          skeleton={
            <BoneSkeleton
              name="article-card-grid"
              loading
              fallback={<ArticleGridSkeleton />}
            >
              <ArticleGridSkeleton />
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
