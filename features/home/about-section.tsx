"use client";

import { useTranslations } from "next-intl";

import { Eyebrow, HapticLink, Section } from "@/components/common";
import { Magnetic, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useHomeContent } from "@/features/settings/hooks";
import { resolveHomeAbout } from "@/features/settings/merge";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Centered About teaser on the home page: eyebrow, two-tone body, CTA to `/about`.
 * Prefers `GET /home` aboutTeaser when present; otherwise `About.*` messages.
 */
export function AboutSection({ className }: { className?: string }) {
  const t = useTranslations("About");
  const homeQuery = useHomeContent();
  const about = resolveHomeAbout(homeQuery.data);

  const eyebrow = about.eyebrow ?? t("eyebrow");
  const heading = about.title ?? eyebrow;

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
        <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
      </Reveal>

      <Reveal as="div" from="bottom" distance={20} delay={0.08}>
        <h2 id="about-heading" className="sr-only">
          {heading}
        </h2>
        {about.body ? (
          <p className="max-w-4xl text-xl/relaxed text-pretty text-ink md:max-w-5xl md:text-2xl xl:text-[1.75rem]/relaxed">
            {about.body}
          </p>
        ) : (
          <p className="max-w-4xl text-xl/relaxed text-pretty md:max-w-5xl md:text-2xl xl:text-[1.75rem]/relaxed">
            <span className="text-ink">{t("bodyLead")} </span>
            <span className="text-ink-muted">{t("bodyMuted")}</span>
          </p>
        )}
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
