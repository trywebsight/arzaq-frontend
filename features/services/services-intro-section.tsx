"use client";

import { useTranslations } from "next-intl";

import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { StaggerGroup } from "@/components/motion";
import { ServiceCard } from "@/features/services/service-card";
import { useServices } from "@/features/services/hooks";
import { cn } from "@/lib/utils";

function ServicesListSkeleton() {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-card bg-muted shadow-sm sm:flex-row"
        >
          <div className="aspect-5/4 w-full shrink-0 animate-pulse bg-muted-foreground/10 sm:aspect-auto sm:min-h-56 sm:w-[min(38%,18rem)] md:min-h-64 md:w-[min(36%,20rem)] xl:min-h-72" />
          <div className="flex flex-1 flex-col justify-center gap-3.5 px-6 py-10 md:px-8 md:py-12 xl:py-14">
            <div className="h-7 w-2/5 animate-pulse rounded bg-muted-foreground/10" />
            <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Services page intro: white header (eyebrow / title / body), then a white
 * band of full-width ServiceCard rows (`bg-muted` on `tone="default"`).
 */
export function ServicesIntroSection({ className }: { className?: string }) {
  const t = useTranslations("ServicesPage.intro");
  const tServices = useTranslations("Services");
  const query = useServices();

  return (
    <div className={cn(className)}>
      <Section
        aria-labelledby="services-page-heading"
        spacing="default"
        tone="default"
        className="pb-10 md:pb-14 xl:pb-16"
      >
        <SectionHeader
          layout="stacked"
          titleAs="h1"
          eyebrow={t("eyebrow")}
          title={t("title")}
          titleId="services-page-heading"
          description={t("body")}
          descriptionClassName="max-w-3xl text-base md:text-lg xl:text-xl"
        />
      </Section>

      <Section
        spacing="default"
        tone="default"
        className="pt-10 md:pt-14 xl:pt-16"
      >
        <QueryState
          query={query}
          emptyTitle={tServices("empty.title")}
          emptyDescription={tServices("empty.description")}
          skeleton={
            <BoneSkeleton
              name="service-card-list"
              loading
              fallback={<ServicesListSkeleton />}
            >
              <ServicesListSkeleton />
            </BoneSkeleton>
          }
        >
          {(services) => (
            <StaggerGroup
              as="ul"
              className="flex list-none flex-col gap-5 md:gap-6"
              selector="[data-card]"
              stagger={0.1}
            >
              {services.map((service) => (
                <li key={service.id} className="min-w-0">
                  <ServiceCard service={service} variant="row" />
                </li>
              ))}
            </StaggerGroup>
          )}
        </QueryState>
      </Section>
    </div>
  );
}
