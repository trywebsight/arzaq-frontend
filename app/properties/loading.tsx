import { BoneSkeleton, Section } from "@/components/common";
import { PropertiesListingGridSkeleton } from "@/features/properties/skeletons";

/**
 * Route-level loading UI for `/properties` while the listing RSC streams.
 */
export default function PropertiesLoading() {
  return (
    <main id="main" className="flex-1" tabIndex={-1}>
      <Section spacing="default" aria-busy="true">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full max-w-xl animate-pulse rounded bg-muted md:h-12" />
        </div>
        <div className="mt-10 space-y-6 md:mt-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-11 w-full animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
          <BoneSkeleton
            name="properties-listing-grid"
            loading
            fallback={<PropertiesListingGridSkeleton />}
          >
            <PropertiesListingGridSkeleton />
          </BoneSkeleton>
        </div>
      </Section>
    </main>
  );
}
