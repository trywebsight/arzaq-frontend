import { BoneSkeleton, Section } from "@/components/common";
import { PropertyDetailSkeleton } from "@/features/properties/skeletons";

/**
 * Route-level loading UI for `/properties/[slug]`.
 */
export default function PropertyDetailLoading() {
  return (
    <main id="main" className="flex-1" tabIndex={-1} aria-busy="true">
      <Section spacing="compact" containerClassName="pt-4 md:pt-6">
        <BoneSkeleton
          name="property-detail"
          loading
          fallback={<PropertyDetailSkeleton />}
        >
          <PropertyDetailSkeleton />
        </BoneSkeleton>
      </Section>
    </main>
  );
}
