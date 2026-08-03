"use client";

import { useTranslations } from "next-intl";

import {
  BoneSkeleton,
  HapticLink,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { StaggerGroup } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/features/services/service-card";
import { useServices } from "@/features/services/hooks";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-card bg-muted/40 sm:flex-row"
        >
          <div className="aspect-5/4 w-full shrink-0 animate-pulse bg-muted sm:aspect-auto sm:min-h-44 sm:w-[min(42%,12rem)]" />
          <div className="flex flex-1 flex-col justify-center gap-2.5 p-5 md:p-6">
            <div className="h-6 w-2/5 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export type ServicesSectionProps = {
  /** Max services to show. @default 2 */
  limit?: number;
  className?: string;
};

/**
 * Home services block: section header plus a QueryState-driven ServiceCard grid.
 *
 * @param limit - Cap from `GET /home` servicesLimit when wired.
 */
export function ServicesSection({
  limit = 2,
  className,
}: ServicesSectionProps) {
  const t = useTranslations("Services");
  const query = useServices({ limit });

  return (
    <Section
      id={SECTION_IDS.services}
      aria-labelledby="services-heading"
      className={cn(className)}
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="services-heading"
        action={
          <Button asChild variant="primary" size="pill-lg">
            <HapticLink href="/services" haptics={false}>
              {t("cta")}
            </HapticLink>
          </Button>
        }
        className="mb-10 md:mb-14"
      />

      <QueryState
        query={query}
        emptyTitle={t("empty.title")}
        emptyDescription={t("empty.description")}
        skeleton={
          <BoneSkeleton
            name="service-card-list"
            loading
            fallback={<ServicesSkeleton />}
          >
            <ServicesSkeleton />
          </BoneSkeleton>
        }
      >
        {(services) => (
          <StaggerGroup
            as="ul"
            className="grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
            selector="[data-card]"
            stagger={0.12}
          >
            {services.map((service) => (
              <li key={service.id} className="min-w-0">
                <ServiceCard service={service} />
              </li>
            ))}
          </StaggerGroup>
        )}
      </QueryState>
    </Section>
  );
}
