import * as React from "react";

import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "@/components/common/container";

export type SectionProps = {
  children: React.ReactNode;
  /**
   * Anchor id for in-page nav / skip targets.
   * When set, applies `scroll-margin-top` via `--scroll-margin-nav`
   * so the floating navbar does not cover the section.
   */
  id?: string;
  /** Rendered element. @default "section" */
  as?: React.ElementType;
  /**
   * Vertical rhythm.
   * @default "default"
   */
  spacing?: "none" | "compact" | "default" | "loose";
  /** Background treatment. @default "default" */
  tone?: "default" | "muted" | "brand" | "ink" | "transparent";
  /** Skip the inner `Container`, e.g. for full-bleed media. @default false */
  bleed?: boolean;
  /** Forwarded to the inner `Container` when `bleed` is false. */
  containerSize?: ContainerProps["size"];
  /** Classes for the outer section element. */
  className?: string;
  /** Classes for the inner container. */
  containerClassName?: string;
  /** Accessible name for the landmark. */
  "aria-labelledby"?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

const spacings: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  compact: "py-12 md:py-16",
  default: "py-16 md:py-24 xl:py-28",
  loose: "py-24 md:py-32 xl:py-40",
};

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background text-ink",
  muted: "bg-muted text-ink",
  brand: "bg-primary text-white",
  ink: "bg-ink text-white",
  transparent: "",
};

/**
 * Vertical rhythm + background tone wrapper for a page section.
 *
 * @example
 * <Section id={SECTION_IDS.properties} tone="muted">
 *   <SectionHeader ... />
 * </Section>
 */
export function Section({
  children,
  id,
  as,
  spacing = "default",
  tone = "default",
  bleed = false,
  containerSize,
  className,
  containerClassName,
  ...rest
}: SectionProps) {
  const Tag = (as ?? "section") as React.ElementType;

  return (
    <Tag
      id={id}
      className={cn(
        "relative w-full",
        id && "scroll-mt-(--scroll-margin-nav)",
        spacings[spacing],
        tones[tone],
        className,
      )}
      {...rest}
    >
      {bleed ? (
        children
      ) : (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  );
}
