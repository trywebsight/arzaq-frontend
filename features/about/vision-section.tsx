"use client";

import { useTranslations } from "next-intl";

import { Eyebrow, Section } from "@/components/common";
import { CountUp, Reveal } from "@/components/motion";
import { useSettings } from "@/features/settings/hooks";
import { resolveHeroStats } from "@/features/settings/merge";
import { cn } from "@/lib/utils";

/**
 * Vision block: muted band with eyebrow, stacked heading/body, and a
 * three-column stats row — values prefer `GET /settings` heroStats.
 */
export function AboutVisionSection({ className }: { className?: string }) {
  const t = useTranslations("AboutPage.vision");
  const tStats = useTranslations("Hero.stats");
  const settingsQuery = useSettings();
  const stats = resolveHeroStats(settingsQuery.data);

  return (
    <Section
      aria-labelledby="about-vision-heading"
      spacing="default"
      tone="muted"
      className={cn(className)}
    >
      <Reveal as="div" from="bottom" distance={14}>
        <Eyebrow className="mb-4 md:mb-5">{t("eyebrow")}</Eyebrow>
      </Reveal>

      <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
        <Reveal as="div" from="bottom" distance={20}>
          <h2
            id="about-vision-heading"
            className="text-2xl/[1.4] font-bold text-balance text-ink md:text-3xl xl:text-4xl "
          >
            {t("title")}
          </h2>
        </Reveal>

        <Reveal as="div" from="bottom" distance={20} delay={0.08}>
          <p className="text-base/relaxed text-pretty text-ink-muted md:text-lg ">
            {t("body")}
          </p>
        </Reveal>
      </div>

      <ul className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 md:mt-10 md:gap-10">
        {stats.map((stat, index) => (
          <li key={stat.key} className="min-w-0">
            <Reveal
              as="div"
              from="bottom"
              distance={18}
              delay={0.1 + index * 0.08}
            >
              <CountUp
                to={stat.value}
                suffix={stat.suffix}
                className="block text-2xl/[1.2] font-bold text-ink sm:text-3xl md:text-4xl "
              />
              <p className="mt-1 text-xs/snug text-pretty text-ink-muted sm:mt-1.5 sm:text-sm/relaxed  ">
                {stat.label ??
                  (tStats.has(`${stat.key}.label`)
                    ? tStats(`${stat.key}.label`)
                    : "")}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
