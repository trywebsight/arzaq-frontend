"use client";

import { ObjectivesCarousel } from "@/features/about/objectives-carousel";
import { Section } from "@/components/common";
import { cn } from "@/lib/utils";

/**
 * Objectives band: header + carousel (arrows sit in the title row).
 */
export function AboutObjectivesSection({ className }: { className?: string }) {
  return (
    <Section
      aria-labelledby="about-objectives-heading"
      spacing="default"
      className={cn(className)}
    >
      <ObjectivesCarousel />
    </Section>
  );
}
