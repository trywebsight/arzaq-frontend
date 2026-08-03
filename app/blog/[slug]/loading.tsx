import { BoneSkeleton, Section } from "@/components/common";
import { ArticleDetailSkeleton } from "@/features/blog/skeletons";

/**
 * Route-level loading UI for `/blog/[slug]`.
 */
export default function ArticleLoading() {
  return (
    <main id="main" className="flex-1" tabIndex={-1} aria-busy="true">
      <Section spacing="compact" containerClassName="pt-4 md:pt-6">
        <BoneSkeleton
          name="article-detail"
          loading
          fallback={<ArticleDetailSkeleton />}
        >
          <ArticleDetailSkeleton />
        </BoneSkeleton>
      </Section>
    </main>
  );
}
