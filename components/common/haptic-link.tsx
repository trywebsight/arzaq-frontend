"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptic";

export type HapticLinkProps = React.ComponentProps<typeof Link> & {
  /**
   * Haptic feedback on press. `true` uses the default pulse, a number or
   * pattern is forwarded to `haptic()`, `false` opts out.
   * @default true
   */
  haptics?: boolean | number | number[];
  /** Adds `target="_blank"` and the matching `rel`. @default false */
  external?: boolean;
};

/**
 * `next/link` that fires haptic feedback on press.
 *
 * Use this for every navigational link so touch users get the same feedback
 * buttons give them.
 */
export function HapticLink({
  haptics = true,
  external = false,
  className,
  onClick,
  target,
  rel,
  ...props
}: HapticLinkProps) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (haptics !== false) {
        haptic(typeof haptics === "boolean" ? undefined : haptics);
      }
      onClick?.(event);
    },
    [haptics, onClick],
  );

  return (
    <Link
      className={cn(
        "cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      onClick={handleClick}
      target={external ? "_blank" : target}
      rel={external ? "noreferrer noopener" : rel}
      {...props}
    />
  );
}
