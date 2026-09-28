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
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-3 md:h-112 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:h-128">
          <div className="aspect-4/3 animate-pulse rounded-media bg-muted md:aspect-auto" />
          <div className="hidden grid-rows-2 gap-3 md:grid">
            <div className="animate-pulse rounded-media bg-muted" />
            <div className="animate-pulse rounded-media bg-muted" />
          </div>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
        <div className="min-w-0 space-y-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-card bg-muted" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-7 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid gap-x-10 rounded-card border border-border px-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between gap-4 border-b border-border py-3.5"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-card bg-muted" />
      </div>
    </div>
  );
}
