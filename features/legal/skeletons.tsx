import { Section } from "@/components/common";
import { cn } from "@/lib/utils";

/**
 * Hand-written Tailwind fallback for legal long-form pages
 * (BoneSkeleton / route loading).
 */
export function LegalDocumentSkeleton({ className }: { className?: string }) {
  return (
    <Section
      spacing="default"
      containerSize="narrow"
      className={cn("pt-6 md:pt-8 xl:pt-10", className)}
      aria-hidden
    >
      <div className="mb-10 flex max-w-prose flex-col gap-4 md:mb-14">
        <div className="h-3 w-28 animate-pulse rounded-sm bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded-sm bg-muted md:h-12" />
        <div className="h-4 w-40 animate-pulse rounded-sm bg-muted" />
        <div className="mt-2 space-y-2">
          <div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-sm bg-muted" />
        </div>
      </div>
      <div className="flex max-w-prose flex-col gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-1/2 animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-11/12 animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded-sm bg-muted" />
          </div>
        ))}
      </div>
    </Section>
  );
}
