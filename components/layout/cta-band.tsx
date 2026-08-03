import { getTranslations } from "next-intl/server";

import { Section } from "@/components/common/section";
import { SectionHeader } from "@/components/common/section-header";
import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import { ROUTES, SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

export type CtaBandProps = {
  /** Extra classes on the outer `Section`. */
  className?: string;
};

/**
 * Shared contact CTA band — eyebrow, title, subtitle, primary pill.
 *
 * Rendered by the layout by default. Pages opt out with `<OptOutCta />`.
 *
 * @example
 * <CtaBand />
 * <CtaBand className="bg-muted" />
 */
export async function CtaBand({ className }: CtaBandProps) {
  const t = await getTranslations("Cta");

  return (
    <Section
      id={SECTION_IDS.contact}
      aria-labelledby="cta-heading"
      spacing="default"
      className={cn(className)}
    >
      <SectionHeader
        align="center"
        layout="stacked"
        titleId="cta-heading"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        action={
          <Button variant="primary" size="pill" asChild haptics={false}>
            <HapticLink href={ROUTES.contact}>
              {t("button")}
            </HapticLink>
          </Button>
        }
      />
    </Section>
  );
}
