import { BoneSkeleton, Section } from "@/components/common";
import { TeamGridSkeleton } from "@/features/team/skeletons";

/**
 * Route-level loading UI for `/team`.
 */
export default function TeamLoading() {
  return (
    <main id="main" className="flex-1" tabIndex={-1}>
      <Section spacing="default" tone="default" aria-busy="true">
        <div className="space-y-4">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted md:h-12" />
        </div>
        <div className="mt-10 md:mt-12">
          <BoneSkeleton
            name="team-grid"
            loading
            fallback={<TeamGridSkeleton />}
          >
            <TeamGridSkeleton />
          </BoneSkeleton>
        </div>
      </Section>
    </main>
  );
}
