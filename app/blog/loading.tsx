import { BoneSkeleton, Section } from "@/components/common";
import { BlogGridSkeleton } from "@/features/blog/skeletons";

/**
 * Route-level loading UI for `/blog`.
 */
export default function BlogLoading() {
  return (
    <main id="main" className="flex-1" tabIndex={-1}>
      <Section spacing="default" aria-busy="true">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-muted md:h-12" />
        </div>
        <div className="mt-10 md:mt-12">
          <BoneSkeleton
            name="blog-listing-grid"
            loading
            fallback={<BlogGridSkeleton />}
          >
            <BlogGridSkeleton />
          </BoneSkeleton>
        </div>
      </Section>
    </main>
  );
}
