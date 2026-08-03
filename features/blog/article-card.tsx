"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { hasImageSrc } from "@/lib/api/media";
import type { Post } from "@/features/blog/types";
import { HapticCard } from "@/components/common/haptic-card";
import { HapticLink } from "@/components/common/haptic-link";
import { Lens } from "@/components/ui/lens";

export type ArticleCardProps = {
  /** Blog post to render. */
  post: Post;
  className?: string;
};

/**
 * Reusable article / blog card — image, title, excerpt and read-more link.
 *
 * @param post - Typed post from the blog feature.
 * @example
 * <ArticleCard post={post} />
 */
export function ArticleCard({ post, className }: ArticleCardProps) {
  const t = useTranslations("Blog");
  const href = `/blog/${post.slug}`;

  return (
    <HapticCard
      href={href}
      linkLabel={t("card.readMoreAria", { title: post.title })}
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-card shadow-xs",
        className,
      )}
      data-card
    >
      <div className="relative z-1 aspect-16/10 w-full shrink-0 overflow-hidden rounded-media bg-muted">
        <HapticLink
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          haptics={false}
          className="absolute inset-0"
        >
          {hasImageSrc(post.image) ? (
            <Lens className="size-full">
              <Image
                {...post.image}
                alt={post.image.alt || post.title}
                className="size-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </Lens>
          ) : (
            <div className="size-full bg-muted" aria-hidden="true" />
          )}
        </HapticLink>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-5 md:p-6">
        <div className="min-h-0 space-y-2 overflow-hidden">
          <h3 className="line-clamp-2 text-lg font-bold text-balance text-ink md:text-xl">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm/relaxed text-pretty text-ink-muted md:text-base ">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-auto flex shrink-0 pt-1">
          <HapticLink
            href={href}
            aria-label={t("card.readMoreAria", { title: post.title })}
            className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("card.readMore")}
            <ChevronRight
              aria-hidden="true"
              className="size-4 rtl:-scale-x-100"
            />
          </HapticLink>
        </div>
      </div>
    </HapticCard>
  );
}
