const TEAM_GRID_COUNT = 6;

/**
 * Team listing grid skeleton (BoneSkeleton fallback / route loading).
 */
export function TeamGridSkeleton({
  count = TEAM_GRID_COUNT,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-card border border-border bg-white"
        >
          <div className="aspect-square w-full animate-pulse bg-muted" />
          <div className="space-y-2 px-5 py-4 text-center">
            <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
