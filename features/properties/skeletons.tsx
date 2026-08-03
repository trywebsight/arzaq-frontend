import { PROPERTIES_PAGE_SIZE } from "@/features/properties/constants";

/**
 * Hand-written listing grid skeleton (BoneSkeleton fallback / route loading).
 */
export function PropertiesListingGridSkeleton({
  count = PROPERTIES_PAGE_SIZE,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-card border border-border"
        >
          <div className="aspect-16/10 w-full shrink-0 animate-pulse bg-muted" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Property detail route skeleton (BoneSkeleton fallback / route loading).
 */
export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-12 md:space-y-16">
      <div className="space-y-4">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-muted md:h-12" />
        <div className="aspect-4/3 min-h-80 w-full animate-pulse rounded-media bg-muted md:aspect-16/10 md:min-h-112 xl:min-h-128" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-11 w-36 shrink-0 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="min-w-0 space-y-4 rounded-card border border-border p-6 md:p-8">
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-5 w-36 animate-pulse rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between gap-4 border-b border-border py-3 last:border-b-0"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div className="aspect-4/3 animate-pulse rounded-media bg-muted" />
        <div className="aspect-4/3 animate-pulse rounded-media bg-muted" />
      </div>
    </div>
  );
}
