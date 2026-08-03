/** Default listing page size — keep in sync with `BLOG_PAGE_SIZE`. */
const DEFAULT_BLOG_GRID_COUNT = 6;

/**
 * Blog listing grid skeleton (BoneSkeleton fallback / route loading).
 */
export function BlogGridSkeleton({
  count = DEFAULT_BLOG_GRID_COUNT,
}: {
  count?: number;
}) {
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
 * Article detail route skeleton (BoneSkeleton fallback / route loading).
 */
export function ArticleDetailSkeleton() {
  return (
    <div className="space-y-12 md:space-y-16">
      <div className="space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full max-w-3xl animate-pulse rounded bg-muted md:h-12" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-muted" />
        <div className="h-5 w-4/5 max-w-xl animate-pulse rounded bg-muted" />
        <div className="aspect-16/10 w-full animate-pulse rounded-media bg-muted md:aspect-21/9" />
      </div>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

/**
 * Related-posts grid skeleton under article detail.
 */
export function RelatedGridSkeleton({ count = 3 }: { count?: number }) {
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
