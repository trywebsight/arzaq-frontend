import * as React from "react";

import { cn } from "@/lib/utils";

export type ContainerProps = {
  children: React.ReactNode;
  /** Rendered element. @default "div" */
  as?: React.ElementType;
  /**
   * Horizontal measure.
   * - `default` — 90rem, the page grid used by every section
   * - `narrow` — 64rem, long-form copy
   * - `wide` — 100rem, edge-to-edge media rows
   * - `full` — no max width, gutters only
   * @default "default"
   */
  size?: "default" | "narrow" | "wide" | "full";
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

const sizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-360",
  narrow: "max-w-5xl",
  wide: "max-w-[100rem]",
  full: "max-w-none",
};

/**
 * Page gutter + measure. Uses logical inline padding, so it mirrors correctly
 * under `dir="rtl"` without any extra classes.
 */
export function Container({
  children,
  as,
  size = "default",
  className,
  ...rest
}: ContainerProps) {
  const Tag = (as ?? "div") as React.ElementType;

  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 md:px-8 xl:px-12",
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
