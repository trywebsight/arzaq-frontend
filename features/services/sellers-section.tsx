"use client";

import { useTranslations } from "next-intl";

import { HapticLink, Section, SectionHeader } from "@/components/common";
import { Magnetic, StaggerGroup } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SELLER_FEATURES } from "@/features/services/content";
import { FeaturePoint } from "@/features/services/feature-point";
import { cn } from "@/lib/utils";

/**
 * Centered “For Sellers” band: eyebrow, heading, 3 feature points, contact CTA.
 */
export function SellersSection({ className }: { className?: string }) {
  const t = useTranslations("ServicesPage.sellers");

  return (
    <Section
      aria-labelledby="services-sellers-heading"
      spacing="default"
      tone="default"
      className={cn(className)}
    >
      <SectionHeader
        align="center"
        layout="stacked"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="services-sellers-heading"
        className="mb-10 md:mb-14"
      />

      <StaggerGroup
        as="ul"
        className="mx-auto grid list-none grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 md:gap-10"
        selector="[data-card]"
        stagger={0.1}
      >
        {SELLER_FEATURES.map((feature) => (
          <li key={feature.id} className="min-w-0">
            <FeaturePoint
              icon={feature.icon}
              description={t(`features.${feature.id}`)}
            />
          </li>
        ))}
      </StaggerGroup>

      <div className="mt-10 flex justify-center md:mt-14">
        <Magnetic max={12} hoverScale={1.03}>
          <Button asChild variant="primary" size="pill-lg">
            <HapticLink href="/contact" haptics={false}>
              {t("cta")}
            </HapticLink>
          </Button>
        </Magnetic>
      </div>
    </Section>
  );
}
