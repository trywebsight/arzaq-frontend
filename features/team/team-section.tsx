"use client";

import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/site";
import { useTeam } from "@/features/team/hooks";
import { TeamCarousel } from "@/features/team/team-carousel";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";

export type TeamSectionProps = {
  /** Max members to fetch. @default 6 */
  limit?: number;
  className?: string;
};

function TeamCarouselSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-hidden md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-[78%] shrink-0 overflow-hidden rounded-card bg-white/15 sm:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <div className="aspect-square animate-pulse bg-white/20" />
            <div className="space-y-2 px-5 py-4">
              <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-white/30" />
              <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-white/20" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="size-11 animate-pulse rounded-full bg-white/25" />
        <div className="size-11 animate-pulse rounded-full bg-white/25" />
      </div>
    </div>
  );
}

/**
 * Full-bleed primary-blue team band with header, CTA and TeamCarousel.
 *
 * @param limit - Cap on members returned by the query.
 * @example
 * <TeamSection />
 */
export function TeamSection({ limit = 6, className }: TeamSectionProps) {
  const t = useTranslations("Team");
  const query = useTeam({ limit });
  const titleId = "team-section-title";

  return (
    <Section
      id={SECTION_IDS.team}
      tone="brand"
      aria-labelledby={titleId}
      className={className}
    >
      <SectionHeader
        tone="inverted"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        titleId={titleId}
        action={
          <Button asChild variant="white" size="pill-lg">
            <HapticLink href="/team" haptics={false}>
              {t("cta")}
            </HapticLink>
          </Button>
        }
      />

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          emptyFallback={
            <div className="rounded-card border border-dashed border-white/40 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-white">
                {t("empty.title")}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
                {t("empty.description")}
              </p>
            </div>
          }
          skeleton={
            <BoneSkeleton
              name="team-carousel"
              loading
              fallback={<TeamCarouselSkeleton />}
            >
              <TeamCarouselSkeleton />
            </BoneSkeleton>
          }
        >
          {(members) => <TeamCarousel members={members} />}
        </QueryState>
      </div>
    </Section>
  );
}
