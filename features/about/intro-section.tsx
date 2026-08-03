"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Eyebrow, Section } from "@/components/common";
import { Reveal } from "@/components/motion";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * About intro: eyebrow, two-column headline/body, then a contained cityscape
 * photo inside page gutters with rounded corners.
 */
export function AboutIntroSection({ className }: { className?: string }) {
  const t = useTranslations("AboutPage.intro");

  return (
    <Section
      aria-labelledby="about-intro-heading"
      spacing="default"
      className={cn(className)}
      containerClassName="flex flex-col"
    >
      <Reveal as="div" from="bottom" distance={14}>
        <Eyebrow className="mb-5 md:mb-6">{t("eyebrow")}</Eyebrow>
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-10 xl:gap-16">
        <Reveal as="div" from="bottom" distance={20}>
          <h1
            id="about-intro-heading"
            className="text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl "
          >
            {t("title")}
          </h1>
        </Reveal>

        <Reveal as="div" from="bottom" distance={20} delay={0.08}>
          <p className="text-base/relaxed text-pretty text-ink-muted md:text-lg xl:text-xl ">
            {t("body")}
          </p>
        </Reveal>
      </div>

      <Reveal
        as="div"
        from="bottom"
        distance={24}
        delay={0.12}
        className="mt-8 md:mt-10 xl:mt-12"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-card md:aspect-21/9">
          <Image
            src={assets.propertyTowerMarina.src}
            alt={t("imageAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 90rem"
            className="object-cover object-center"
          />
        </div>
      </Reveal>
    </Section>
  );
}
