"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

import type { Post } from "@/features/blog/types";
import { ArticleCard } from "@/features/blog/article-card";
import { useLatestPosts, usePost } from "@/features/blog/hooks";
import {
  ArticleDetailSkeleton,
  RelatedGridSkeleton,
} from "@/features/blog/skeletons";
import {
  BoneSkeleton,
  Eyebrow,
  HapticLink,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { Reveal, StaggerGroup } from "@/components/motion";
import { Lens } from "@/components/ui/lens";
import { hasImageSrc } from "@/lib/api/media";
import { cn } from "@/lib/utils";

/** Related grid size — always three cards excluding the current slug. */
const RELATED_COUNT = 3;
/** Fetch enough latest posts so filtering the current slug still fills the grid. */
const RELATED_FETCH_LIMIT = RELATED_COUNT + 1;

export type ArticleDetailProps = {
  /** Route slug matching `postQuery` / ArticleCard href. */
  slug: string;
  className?: string;
};

/**
 * Blog article detail — hero, structured body, and related ArticleCards.
 *
 * @param slug - Route slug from `/blog/[slug]`.
 * @example
 * <ArticleDetail slug="increase-home-value-before-selling" />
 */
export function ArticleDetail({ slug, className }: ArticleDetailProps) {
  const t = useTranslations("ArticlePage");
  const query = usePost(slug);

  return (
    <main
      id="main"
      tabIndex={-1}
      className={cn("flex-1", className)}
      aria-labelledby="article-detail-heading"
    >
      <Section spacing="compact" containerClassName="pt-4 md:pt-6">
        <QueryState
          query={query}
          isEmpty={(data) => data == null}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          skeleton={
            <BoneSkeleton
              name="article-detail"
              loading
              fallback={<ArticleDetailSkeleton />}
            >
              <ArticleDetailSkeleton />
            </BoneSkeleton>
          }
        >
          {(post) => (post ? <ArticleDetailContent post={post} /> : null)}
        </QueryState>
      </Section>
    </main>
  );
}

function ArticleDetailContent({ post }: { post: Post }) {
  const t = useTranslations("ArticlePage");

  return (
    <div className="space-y-14 md:space-y-20">
      <header className="space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal as="div" from="bottom" distance={12} trigger="mount">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal
            as="div"
            from="bottom"
            distance={12}
            delay={0.05}
            trigger="mount"
          >
            <HapticLink
              href="/blog"
              aria-label={t("backAria")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-primary"
            >
              <ChevronLeft
                aria-hidden="true"
                className="size-4 rtl:-scale-x-100"
              />
              {t("back")}
            </HapticLink>
          </Reveal>
        </div>

        <Reveal as="div" from="bottom" distance={18} delay={0.06} trigger="mount">
          <h1
            id="article-detail-heading"
            className="max-w-3xl text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl "
          >
            {post.title}
          </h1>
        </Reveal>

        <Reveal as="div" from="bottom" distance={16} delay={0.1} trigger="mount">
          <p className="max-w-2xl text-base/relaxed text-pretty text-ink-muted md:text-lg ">
            {post.excerpt}
          </p>
        </Reveal>

        <Reveal as="div" from="bottom" distance={22} delay={0.14} trigger="mount">
          {hasImageSrc(post.image) ? (
            <Lens className="relative aspect-16/10 overflow-hidden rounded-media md:aspect-21/9">
              <Image
                src={post.image.src}
                alt={post.image.alt || post.title}
                priority
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
              />
            </Lens>
          ) : (
            <div
              className="aspect-16/10 rounded-media bg-muted md:aspect-21/9"
              aria-hidden="true"
            />
          )}
        </Reveal>
      </header>

      <article className="mx-auto max-w-3xl">
        <div className="space-y-8 md:space-y-10">
          {post.sections.map((section, index) => (
            <Reveal
              key={`${section.title ?? "intro"}-${index}`}
              as="div"
              from="bottom"
              distance={16}
              delay={Math.min(index * 0.04, 0.2)}
              className="space-y-3"
            >
              {section.title ? (
                <h2 className="text-xl font-bold text-balance text-ink md:text-2xl">
                  {section.title}
                </h2>
              ) : null}
              <p className="text-base/relaxed text-pretty text-ink-muted md:text-lg ">
                {section.body}
              </p>
            </Reveal>
          ))}
        </div>
      </article>

      <RelatedArticles currentSlug={post.slug} />
    </div>
  );
}

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations("ArticlePage");
  const tBlog = useTranslations("Blog");
  const query = useLatestPosts(RELATED_FETCH_LIMIT);
  const titleId = "related-articles-title";

  return (
    <section aria-labelledby={titleId} className="border-t border-border pt-14 md:pt-20">
      <SectionHeader
        eyebrow={t("related.eyebrow")}
        title={t("related.title")}
        description={t("related.subtitle")}
        titleId={titleId}
        layout="stacked"
      />

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          isEmpty={() => false}
          emptyTitle={tBlog("empty.title")}
          emptyDescription={tBlog("empty.description")}
          skeleton={
            <BoneSkeleton
              name="related-article-grid"
              loading
              fallback={<RelatedGridSkeleton />}
            >
              <RelatedGridSkeleton />
            </BoneSkeleton>
          }
        >
          {(posts) => {
            const related = Array.isArray(posts)
              ? posts
                  .filter((item) => item.slug !== currentSlug)
                  .slice(0, RELATED_COUNT)
              : [];

            if (related.length === 0) return null;

            return (
              <StaggerGroup
                className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3"
                stagger={0.1}
              >
                {related.map((item) => (
                  <ArticleCard key={item.id} post={item} className="h-full" />
                ))}
              </StaggerGroup>
            );
          }}
        </QueryState>
      </div>
    </section>
  );
}
