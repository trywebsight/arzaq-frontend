"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptic";
import { HapticLink } from "@/components/common/haptic-link";

export type HapticCardProps = {
  children: React.ReactNode;
  /**
   * Makes the whole card navigable via a stretched overlay link.
   * Nested interactive elements must sit above it — give them
   * `relative z-10` (see the `z-10` note below).
   */
  href?: string;
  /** Accessible name for the stretched link. Required whenever `href` is set. */
  linkLabel?: string;
  /** Opens `href` in a new tab. @default false */
  external?: boolean;
  /** Rendered element. @default "article" */
  as?: React.ElementType;
  /** Hover lift + shadow. @default true */
  interactive?: boolean;
  /**
   * Haptic feedback on press. `true` uses the default pulse, a number or
   * pattern is forwarded to `haptic()`, `false` opts out.
   * @default true
   */
  haptics?: boolean | number | number[];
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Card surface that fires haptic feedback on press and can turn its whole
 * area into a single link target.
 *
 * The overlay link is rendered at `z-0` inside an `isolate` stacking context.
 * Any control that must stay independently clickable — a call button, a
 * WhatsApp action — needs `relative z-10`.
 *
 * @example
 * <HapticCard href={`/properties/${property.slug}`} linkLabel={property.title}>
 *   <Image ... />
 *   <h3>{property.title}</h3>
 *   <Button className="relative z-10" ... />
 * </HapticCard>
 */
export const HapticCard = React.forwardRef<HTMLElement, HapticCardProps>(
  function HapticCard(
    {
      children,
      href,
      linkLabel,
      external = false,
      as,
      interactive = true,
      haptics = true,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const Tag = (as ?? "article") as React.ElementType;

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (haptics !== false) {
          haptic(typeof haptics === "boolean" ? undefined : haptics);
        }
        onClick?.(event);
      },
      [haptics, onClick],
    );

    return (
      <Tag
        ref={ref}
        className={cn(
          "relative isolate",
          href && "cursor-pointer",
          interactive &&
            "transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md focus-within:-translate-y-1.5 focus-within:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 motion-reduce:hover:shadow-xs motion-reduce:focus-within:shadow-xs",
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        {href ? (
          <HapticLink
            href={href}
            external={external}
            aria-label={linkLabel}
            className="absolute inset-0 z-0 rounded-[inherit]"
            haptics={false}
            tabIndex={0}
          >
            <span className="sr-only">{linkLabel}</span>
          </HapticLink>
        ) : null}
        {children}
      </Tag>
    );
  },
);
