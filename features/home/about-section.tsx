"use client";

import { useTranslations } from "next-intl";

import { Eyebrow, HapticLink, Section } from "@/components/common";
import { Magnetic, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Centered About teaser on the home page: eyebrow, two-tone body, CTA to `/about`.
 */
export function AboutSection({ className }: { className?: string }) {
  const t = useTranslations("About");

  return (
    <Section
      id={SECTION_IDS.about}
      aria-labelledby="about-heading"
      spacing="loose"
      className={cn(className)}
      containerSize="default"
      containerClassName="flex flex-col items-center text-center"
    >
      <Reveal as="div" from="bottom" distance={14}>
        <Eyebrow className="mb-5">{t("eyebrow")}</Eyebrow>
      </Reveal>

      <Reveal as="div" from="bottom" distance={20} delay={0.08}>
        <h2 id="about-heading" className="sr-only">
          {t("eyebrow")}
        </h2>
        <p className="max-w-4xl text-xl/relaxed text-pretty md:max-w-5xl md:text-2xl xl:text-[1.75rem]/relaxed">
          <span className="text-ink">{t("bodyLead")} </span>
          <span className="text-ink-muted">{t("bodyMuted")}</span>
        </p>
      </Reveal>

      <Reveal
        as="div"
        from="bottom"
        distance={16}
        delay={0.18}
        className="mt-8 md:mt-10"
      >
        <Magnetic max={12} hoverScale={1.03}>
          <Button asChild variant="primary" size="pill-lg">
            <HapticLink href="/about" haptics={false}>
              {t("cta")}
            </HapticLink>
          </Button>
        </Magnetic>
      </Reveal>
    </Section>
  );
}
