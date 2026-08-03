"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { HapticLink, Section, SectionHeader } from "@/components/common";
import { Magnetic, Reveal, StaggerGroup } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { BUYER_FEATURES } from "@/features/services/content";
import { FeaturePoint } from "@/features/services/feature-point";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Centered “For Buyers” band: heading, CTA, villa image, then 3 feature points.
 */
export function BuyersSection({ className }: { className?: string }) {
  const t = useTranslations("ServicesPage.buyers");

  return (
    <Section
      aria-labelledby="services-buyers-heading"
      spacing="default"
      tone="muted"
      className={cn(className)}
    >
      <SectionHeader
        align="center"
        layout="stacked"
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleId="services-buyers-heading"
        action={
          <Magnetic max={12} hoverScale={1.03}>
            <Button asChild variant="primary" size="pill-lg">
              <HapticLink href="/contact" haptics={false}>
                {t("cta")}
              </HapticLink>
            </Button>
          </Magnetic>
        }
        className="mb-10 md:mb-12"
      />

      <Reveal as="div" from="bottom" distance={24} delay={0.08}>
        <div className="relative aspect-video w-full overflow-hidden rounded-card md:aspect-21/9">
          <Image
            src={assets.propertyVillaPool.src}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 90rem"
            className="object-cover object-center"
          />
        </div>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="mx-auto mt-10 grid list-none grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 md:mt-14 md:gap-10"
        selector="[data-card]"
        stagger={0.1}
      >
        {BUYER_FEATURES.map((feature) => (
          <li key={feature.id} className="min-w-0">
            <FeaturePoint
              icon={feature.icon}
              description={t(`features.${feature.id}`)}
            />
          </li>
        ))}
      </StaggerGroup>
    </Section>
  );
}
