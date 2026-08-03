"use client";

import { useTranslations } from "next-intl";

import { useTeam } from "@/features/team/hooks";
import { TeamCard } from "@/features/team/team-card";
import { TeamGridSkeleton } from "@/features/team/skeletons";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { StaggerGroup } from "@/components/motion";

/**
 * Team listing — white page with eyebrow header and a fixed 3-column member grid.
 *
 * @example
 * <TeamListing />
 */
export function TeamListing() {
  const t = useTranslations("TeamPage");
  const query = useTeam();
  const titleId = "team-listing-title";

  return (
    <Section aria-labelledby={titleId} spacing="default" tone="default">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleAs="h1"
        titleId={titleId}
        layout="stacked"
      />

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          emptyFallback={
            <div className="rounded-card border border-dashed border-border px-6 py-12 text-center">
              <p className="text-lg font-semibold text-ink">
                {t("empty.title")}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                {t("empty.description")}
              </p>
            </div>
          }
          skeleton={
            <BoneSkeleton
              name="team-grid"
              loading
              fallback={<TeamGridSkeleton />}
            >
              <TeamGridSkeleton />
            </BoneSkeleton>
          }
        >
          {(members) => (
            <StaggerGroup
              className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
              stagger={0.08}
            >
              {members.map((member) => (
                <TeamCard key={member.id} member={member} className="h-full" />
              ))}
            </StaggerGroup>
          )}
        </QueryState>
      </div>
    </Section>
  );
}
