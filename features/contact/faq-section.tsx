"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Eyebrow, Section } from "@/components/common";
import { Reveal } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES } from "@/features/contact/content";
import { cn } from "@/lib/utils";

/**
 * FAQ block: category heading + bordered accordion cards with +/- toggles.
 */
export function FaqSection({ className }: { className?: string }) {
  const t = useTranslations("ContactPage.faq");

  return (
    <Section
      id="faq"
      aria-labelledby="faq-heading"
      tone="muted"
      spacing="default"
      className={cn(className)}
    >
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12 xl:gap-20">
        <div className="min-w-0 md:sticky md:top-32">
          <Reveal as="div" from="bottom" distance={14}>
            <Eyebrow className="mb-5 md:mb-6">{t("eyebrow")}</Eyebrow>
          </Reveal>

          <Reveal as="div" from="bottom" distance={20}>
            <h2
              id="faq-heading"
              className="text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl "
            >
              {t("title")}
            </h2>
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-col gap-10 md:gap-12">
          {FAQ_CATEGORIES.map((category, categoryIndex) => (
            <Reveal
              key={category.id}
              as="div"
              from="bottom"
              distance={20}
              delay={0.06 * categoryIndex}
            >
              <h3 className="mb-4 text-lg font-bold text-ink md:mb-5 md:text-xl">
                {t(`categories.${category.id}.title`)}
              </h3>

              <Accordion
                type="single"
                collapsible
                className="gap-3"
                defaultValue={
                  categoryIndex === 0 && category.items[0]
                    ? `${category.id}-${category.items[0]}`
                    : undefined
                }
              >
                {category.items.map((itemId) => {
                  const value = `${category.id}-${itemId}`;
                  return (
                    <AccordionItem
                      key={value}
                      value={value}
                      className="rounded-xl border border-border bg-background px-4 not-last:border-b-0 md:px-5"
                    >
                      <AccordionTrigger
                        className={cn(
                          "gap-3 py-4 hover:no-underline md:py-5",
                          "**:data-[slot=accordion-trigger-icon]:hidden",
                        )}
                      >
                        <span className="flex-1 text-start text-base font-semibold text-ink md:text-[1.0625rem]">
                          {t(`categories.${category.id}.items.${itemId}.question`)}
                        </span>
                        <span
                          aria-hidden
                          className="ms-auto flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
                        >
                          <Plus className="size-4 group-aria-expanded/accordion-trigger:hidden" />
                          <Minus className="size-4 hidden group-aria-expanded/accordion-trigger:block" />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-base/relaxed text-pretty text-ink-muted md:pb-5 ">
                        {t(`categories.${category.id}.items.${itemId}.answer`)}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
