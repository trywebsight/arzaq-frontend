"use client";

import { useTranslations } from "next-intl";

import { ObjectiveCard } from "@/features/about/objective-card";
import { ABOUT_OBJECTIVES } from "@/features/about/content";
import { SectionHeader } from "@/components/common";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type ObjectivesCarouselProps = {
  className?: string;
};

const navButtonClassName =
  "static inset-auto size-11 translate-none rounded-lg shadow-xs transition-[transform,opacity,background-color] duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:hover:scale-100 [&_svg:not([class*='size-'])]:size-5";

/**
 * Objectives carousel with prev/next controls in the section header row
 * (inline-end), cards below.
 *
 * @example
 * <ObjectivesCarousel />
 */
export function ObjectivesCarousel({ className }: ObjectivesCarouselProps) {
  const t = useTranslations("AboutPage.objectives");

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
        skipSnaps: false,
        dragFree: false,
        containScroll: "trimSnaps",
        duration: 28,
      }}
      className={cn("w-full", className)}
      aria-label={t("title")}
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        titleId="about-objectives-heading"
        className="mb-10 md:mb-12"
        action={
          <div className="flex items-center gap-2.5">
            <CarouselPrevious
              variant="primary"
              size="icon-lg"
              className={navButtonClassName}
            />
            <CarouselNext
              variant="primary"
              size="icon-lg"
              className={navButtonClassName}
            />
          </div>
        }
      />

      <CarouselContent className="-ms-4 md:-ms-6">
        {ABOUT_OBJECTIVES.map((objective) => (
          <CarouselItem
            key={objective.id}
            className="ps-4 basis-[85%] sm:basis-1/2 md:ps-6 lg:basis-[40%] xl:basis-1/3"
          >
            <ObjectiveCard
              icon={objective.icon}
              title={t(`items.${objective.id}.title`)}
              description={t(`items.${objective.id}.description`)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
