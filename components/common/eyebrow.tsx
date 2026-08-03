import * as React from "react";

import { cn } from "@/lib/utils";

export type EyebrowProps = {
  children: React.ReactNode;
  /** Colour of the leading dot and the label. @default "brand" */
  tone?: "brand" | "ink" | "white";
  /** Hide the leading dot. @default false */
  hideDot?: boolean;
  /** Rendered element. @default "p" */
  as?: React.ElementType;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

const tones: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "text-primary",
  ink: "text-ink-muted",
  white: "text-white/80",
};

const dotTones: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  brand: "bg-primary",
  ink: "bg-ink-muted",
  white: "bg-white",
};

/**
 * Small dot + uppercase-style label that opens every section.
 *
 * Uses `me-*` (margin-inline-end) for the dot gap so it sits on the correct
 * side under `dir="rtl"` with no mirroring class.
 */
export function Eyebrow({
  children,
  tone = "brand",
  hideDot = false,
  as,
  className,
  ...rest
}: EyebrowProps) {
  const Tag = (as ?? "p") as React.ElementType;

  return (
    <Tag
      className={cn(
        "inline-flex items-center text-sm font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {!hideDot ? (
        <span
          aria-hidden="true"
          className={cn("me-2 inline-block size-1.5 rounded-full", dotTones[tone])}
        />
      ) : null}
      {children}
    </Tag>
  );
}
