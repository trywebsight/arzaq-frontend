import * as React from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";

export type SectionHeaderProps = {
  /** Small label above the title. Omit to hide. */
  eyebrow?: React.ReactNode;
  /** Section title. Rendered as `titleAs`. */
  title: React.ReactNode;
  /** Supporting sentence under the title. */
  description?: React.ReactNode;
  /** Usually a `<Button>`. Sits at the inline end on md+ in `split` layout. */
  action?: React.ReactNode;
  /**
   * `split` puts the action opposite the text from `md` up.
   * `stacked` always puts it below.
   * @default "split"
   */
  layout?: "split" | "stacked";
  /** Text alignment. @default "start" */
  align?: "start" | "center";
  /** `inverted` is for the blue and ink sections. @default "default" */
  tone?: "default" | "inverted";
  /** Heading level. @default "h2" */
  titleAs?: React.ElementType;
  /** Set when the parent section uses `aria-labelledby`. */
  titleId?: string;
  /**
   * Run the masked line reveal on the title and fade the rest in.
   * Turn off inside carousels or already-animated containers.
   * @default true
   */
  animate?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  eyebrowClassName?: string;
};

/**
 * The shared section heading block — eyebrow, title, description and an
 * optional action — used verbatim by Properties, Services, Team, Blog and the
 * CTA band.
 *
 * @example
 * <SectionHeader
 *   eyebrow={t("eyebrow")}
 *   title={t("title")}
 *   description={t("subtitle")}
 *   action={<Button variant="primary" size="pill">{t("cta")}</Button>}
 * />
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  layout = "split",
  align = "start",
  tone = "default",
  titleAs = "h2",
  titleId,
  animate = true,
  className,
  titleClassName,
  descriptionClassName,
  eyebrowClassName,
}: SectionHeaderProps) {
  const inverted = tone === "inverted";

  const titleClasses = cn(
    "text-3xl/[1.4] font-bold text-balance md:text-4xl xl:text-5xl ",
    inverted ? "text-white" : "text-ink",
    titleClassName,
  );

  const eyebrowNode = eyebrow ? (
    <Eyebrow
      tone={inverted ? "white" : "brand"}
      className={cn("mb-4", eyebrowClassName)}
    >
      {eyebrow}
    </Eyebrow>
  ) : null;

  const descriptionNode = description ? (
    <p
      className={cn(
        "mt-4 max-w-2xl text-base/relaxed text-pretty md:text-lg ",
        inverted ? "text-white/80" : "text-ink-muted",
        align === "center" && "mx-auto",
        descriptionClassName,
      )}
    >
      {description}
    </p>
  ) : null;

  return (
    <div
      className={cn(
        "w-full",
        layout === "split" && action
          ? "flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          : "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className={cn("min-w-0", align === "center" && "text-center")}>
        {animate ? (
          <>
            {eyebrowNode ? (
              <Reveal as="div" from="bottom" distance={14}>
                {eyebrowNode}
              </Reveal>
            ) : null}

            <SplitHeading as={titleAs} id={titleId} className={titleClasses}>
              {title}
            </SplitHeading>

            {descriptionNode ? (
              <Reveal as="div" from="bottom" distance={16} delay={0.12}>
                {descriptionNode}
              </Reveal>
            ) : null}
          </>
        ) : (
          <>
            {eyebrowNode}
            {React.createElement(
              titleAs,
              { id: titleId, className: titleClasses },
              title,
            )}
            {descriptionNode}
          </>
        )}
      </div>

      {action ? (
        <div
          className={cn(
            "shrink-0",
            layout === "split" && "md:pt-1",
            align === "center" && "mx-auto",
          )}
        >
          {animate ? (
            <Reveal as="div" from="bottom" distance={16} delay={0.18}>
              {action}
            </Reveal>
          ) : (
            action
          )}
        </div>
      ) : null}
    </div>
  );
}
