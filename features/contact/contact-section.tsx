"use client";

import { useTranslations } from "next-intl";

import { Eyebrow, Section } from "@/components/common";
import { Reveal } from "@/components/motion";
import { ContactForm } from "@/features/contact/contact-form";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Contact intro + form: two columns on md+, stacked intro-then-form on mobile.
 */
/**
 * @param initialMessage - Forwarded to the form, e.g. a property enquiry.
 */
export function ContactSection({
  className,
  initialMessage,
}: {
  className?: string;
  initialMessage?: string;
}) {
  const t = useTranslations("ContactPage.contact");

  return (
    <Section
      id={SECTION_IDS.contact}
      aria-labelledby="contact-heading"
      spacing="default"
      className={cn(className)}
    >
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12 xl:gap-20">
        <div className="min-w-0">
          <Reveal as="div" from="bottom" distance={14}>
            <Eyebrow className="mb-5 md:mb-6">{t("eyebrow")}</Eyebrow>
          </Reveal>

          <Reveal as="div" from="bottom" distance={20}>
            <h1
              id="contact-heading"
              className="text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl "
            >
              {t("title")}
            </h1>
          </Reveal>

          <Reveal as="div" from="bottom" distance={16} delay={0.08}>
            <p className="mt-4 max-w-md text-base/relaxed text-pretty text-ink-muted md:mt-5 md:text-lg ">
              {t("body")}
            </p>
          </Reveal>
        </div>

        <Reveal as="div" from="bottom" distance={24} delay={0.1}>
          <ContactForm initialMessage={initialMessage} />
        </Reveal>
      </div>
    </Section>
  );
}
