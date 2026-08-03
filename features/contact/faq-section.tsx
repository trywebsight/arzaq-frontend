"use client";

import { Minus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  BoneSkeleton,
  Eyebrow,
  QueryState,
  Section,
} from "@/components/common";
import { Reveal } from "@/components/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CATEGORIES } from "@/features/contact/content";
import { faqsQuery } from "@/features/contact/faq-queries";
import type { FaqCategory as ApiFaqCategory } from "@/features/contact/faq-types";
import { cn } from "@/lib/utils";

function FaqSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-10 md:gap-12">
      {Array.from({ length: 2 }).map((_, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          {Array.from({ length: 3 }).map((__, itemIndex) => (
            <div
              key={itemIndex}
              className="h-14 animate-pulse rounded-xl border border-border bg-background"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type FaqAccordionProps = {
  categories: readonly {
    id: string;
    title: string;
    items: readonly { id: string; question: string; answer: string }[];
  }[];
};

function FaqAccordions({ categories }: FaqAccordionProps) {
  return (
    <div className="flex min-w-0 flex-col gap-10 md:gap-12">
      {categories.map((category, categoryIndex) => (
        <Reveal
          key={category.id}
          as="div"
          from="bottom"
          distance={20}
          delay={0.06 * categoryIndex}
        >
          <h3 className="mb-4 text-lg font-bold text-ink md:mb-5 md:text-xl">
            {category.title}
          </h3>

          <Accordion
            type="single"
            collapsible
            className="gap-3"
            defaultValue={
              categoryIndex === 0 && category.items[0]
                ? `${category.id}-${category.items[0].id}`
                : undefined
            }
          >
            {category.items.map((item) => {
              const value = `${category.id}-${item.id}`;
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
                      {item.question}
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
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Reveal>
      ))}
    </div>
  );
}

function StaticFaqAccordions() {
  const t = useTranslations("ContactPage.faq");

  const categories = FAQ_CATEGORIES.map((category) => ({
    id: category.id,
    title: t(`categories.${category.id}.title`),
    items: category.items.map((itemId) => ({
      id: itemId,
      question: t(`categories.${category.id}.items.${itemId}.question`),
      answer: t(`categories.${category.id}.items.${itemId}.answer`),
    })),
  }));

  return <FaqAccordions categories={categories} />;
}

function CmsFaqAccordions({ categories }: { categories: ApiFaqCategory[] }) {
  const filtered = categories
    .map((category) => ({
      id: category.id,
      title: category.title,
      items: category.items.filter(
        (item) => item.question.trim() && item.answer.trim(),
      ),
    }))
    .filter((category) => category.items.length > 0);

  if (filtered.length === 0) return <StaticFaqAccordions />;
  return <FaqAccordions categories={filtered} />;
}

/**
 * FAQ block: category heading + bordered accordion cards with +/- toggles.
 * Prefers `GET /faqs` when categories are non-empty; otherwise messages.
 */
export function FaqSection({ className }: { className?: string }) {
  const t = useTranslations("ContactPage.faq");
  const query = useQuery(faqsQuery());

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

        <QueryState
          query={query}
          isEmpty={() => false}
          errorFallback={<StaticFaqAccordions />}
          skeleton={
            <BoneSkeleton
              name="faq-accordion"
              loading
              fallback={<FaqSkeleton />}
            >
              <FaqSkeleton />
            </BoneSkeleton>
          }
          className="min-w-0"
        >
          {(data) =>
            data.categories.length > 0 ? (
              <CmsFaqAccordions categories={data.categories} />
            ) : (
              <StaticFaqAccordions />
            )
          }
        </QueryState>
      </div>
    </Section>
  );
}
