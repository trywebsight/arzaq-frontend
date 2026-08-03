"use client";

import { useTranslations } from "next-intl";

import { Container, Eyebrow, SmartImage } from "@/components/common";
import { CountUp, Reveal, SplitHeading } from "@/components/motion";
import { assets } from "@/lib/assets";
import { HERO_STATS, SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Home hero: full-bleed photography on mobile; white page frame + rounded
 * media from `md` up. SplitText headline and CountUp stats sit at the
 * bottom; RTL places the heading at inline-start without reverse helpers.
 */
export function HeroSection({ className }: { className?: string }) {
  const t = useTranslations("Hero");

  return (
    <section
      id={SECTION_IDS.hero}
      aria-labelledby="hero-heading"
      className={cn(
        "relative w-full scroll-mt-(--scroll-margin-nav) bg-background",
        "p-0 md:p-(--hero-frame-md) xl:p-(--hero-frame-xl)",
        className,
      )}
    >
      <div
        className={cn(
          "relative isolate flex w-full items-end overflow-hidden",
          "h-svh md:h-[calc(100svh-2*var(--hero-frame-md))] xl:h-[calc(100svh-2*var(--hero-frame-xl))]",
          "min-h-112",
          "rounded-none md:rounded-(--hero-radius-md) xl:rounded-(--hero-radius-xl)",
        )}
      >
        <SmartImage
          src={assets.hero.src}
          alt={t("imageAlt")}
          priority
          fill
          sizes="100vw"
          quality={70}
          className="object-cover object-center"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.32,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"
        />

        <Container className="relative z-10 w-full pb-10 pt-28 md:pb-14 md:pt-36 xl:pb-18">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="min-w-0 max-w-2xl text-start">
              <Reveal as="div" from="bottom" distance={14} trigger="mount">
                <Eyebrow tone="white" className="mb-4">
                  {t("eyebrow")}
                </Eyebrow>
              </Reveal>

              <SplitHeading
                as="h1"
                id="hero-heading"
                trigger="mount"
                className="text-4xl/[1.35] font-bold text-balance text-white md:text-5xl xl:text-6xl "
              >
                {t("title")}
              </SplitHeading>
            </div>

            <ul className="flex w-full shrink-0 flex-row gap-3 text-start sm:gap-8 md:w-auto md:gap-12">
              {HERO_STATS.map((stat, index) => (
                <li key={stat.key} className="min-w-0 flex-1 md:flex-none md:min-w-30">
                  <Reveal
                    as="div"
                    from="bottom"
                    distance={18}
                    delay={0.15 + index * 0.08}
                    trigger="mount"
                  >
                    <CountUp
                      to={stat.value}
                      suffix={stat.suffix}
                      trigger="mount"
                      delay={0.2 + index * 0.08}
                      className="block text-3xl/[1.2] font-bold text-white sm:text-4xl md:text-5xl "
                    />
                    <p className="mt-1 text-xs/snug text-pretty text-white/75 sm:mt-1.5 sm:max-w-44 sm:text-sm/relaxed md:text-base  ">
                      {t(`stats.${stat.key}.label`)}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
