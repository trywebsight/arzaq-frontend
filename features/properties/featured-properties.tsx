"use client";

import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/site";
import { useFeaturedProperties } from "@/features/properties/hooks";
import { PropertyCard } from "@/features/properties/property-card";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { HapticLink } from "@/components/common/haptic-link";
import { StaggerGroup } from "@/components/motion";
import { Button } from "@/components/ui/button";

export type FeaturedPropertiesProps = {
  /** Max featured listings to show. @default 3 */
  limit?: number;
  className?: string;
};

function PropertyGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="mt-auto h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Home-page featured properties section — header, QueryState grid and
 * staggered PropertyCards.
 *
 * @param limit - Cap on featured listings. Defaults to 3.
 * @example
 * <FeaturedProperties limit={3} />
 */
export function FeaturedProperties({
  limit = 3,
  className,
}: FeaturedPropertiesProps) {
  const t = useTranslations("Properties");
  const query = useFeaturedProperties(limit);
  const titleId = "featured-properties-title";

  return (
    <Section
      id={SECTION_IDS.properties}
      aria-labelledby={titleId}
      className={className}
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        titleId={titleId}
        action={
          <Button asChild variant="primary" size="pill-lg">
            <HapticLink href="/properties" haptics={false}>
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
          skeleton={
            <BoneSkeleton
              name="property-card-grid"
              loading
              fallback={<PropertyGridSkeleton />}
            >
              <PropertyGridSkeleton />
            </BoneSkeleton>
          }
        >
          {(properties) => (
            <StaggerGroup
              className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3"
              stagger={0.1}
            >
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  className="h-full"
                />
              ))}
            </StaggerGroup>
          )}
        </QueryState>
      </div>
    </Section>
  );
}
