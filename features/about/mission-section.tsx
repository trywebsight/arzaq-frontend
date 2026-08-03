"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Eyebrow, HapticLink, Section } from "@/components/common";
import { Magnetic, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Mission block: small rounded landscape at inline-start; large dark body +
 * contact-page pill at inline-end.
 */
export function AboutMissionSection({ className }: { className?: string }) {
  const t = useTranslations("AboutPage.mission");

  return (
    <Section
      aria-labelledby="about-mission-heading"
      spacing="default"
      className={cn(className)}
    >
      <Reveal as="div" from="bottom" distance={14}>
        <Eyebrow className="mb-5 md:mb-6">{t("eyebrow")}</Eyebrow>
      </Reveal>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10 xl:gap-14">
        <Reveal
          as="div"
          from="bottom"
          distance={20}
          className="relative aspect-5/4 w-full max-w-[18rem] shrink-0 overflow-hidden rounded-card sm:max-w-[20rem] md:aspect-4/3 md:w-[min(36%,20rem)] xl:w-[min(34%,22rem)]"
        >
          <Image
            src={assets.towerAlManar.src}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 768px) 20rem, 22rem"
            className="object-cover object-center"
          />
        </Reveal>

        <div className="min-w-0 flex-1">
          <Reveal as="div" from="bottom" distance={20} delay={0.08}>
            <h2 id="about-mission-heading" className="sr-only">
              {t("eyebrow")}
            </h2>
            <p className="text-lg/relaxed font-medium text-pretty text-ink md:text-xl xl:text-2xl/relaxed">
              {t("body")}
            </p>
          </Reveal>

          <Reveal
            as="div"
            from="bottom"
            distance={16}
            delay={0.16}
            className="mt-6 md:mt-8"
          >
            <Magnetic max={12} hoverScale={1.03}>
              <Button asChild variant="primary" size="pill-lg">
                <HapticLink href={ROUTES.contact} haptics={false}>
                  {t("cta")}
                </HapticLink>
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
