"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  DURATION,
  EASE,
  SCROLL_START,
  gsap,
  matchMotion,
  useGSAP,
} from "@/lib/gsap";

export type CountUpProps = {
  /** Final value. */
  to: number;
  /** Starting value. @default 0 */
  from?: number;
  /** Rendered before the number, inside the same element. */
  prefix?: string;
  /** Rendered after the number, inside the same element. */
  suffix?: string;
  /** Fraction digits. @default 0 */
  decimals?: number;
  /** Thousands grouping. @default false */
  grouping?: boolean;
  /** Seconds. @default DURATION.count (1.6) */
  duration?: number;
  /** Seconds. @default 0 */
  delay?: number;
  /** GSAP ease string. @default EASE.out */
  ease?: string;
  /** @default "scroll" */
  trigger?: "scroll" | "mount";
  /** ScrollTrigger `start`. @default "clamp(top 85%)" */
  start?: string;
  /** @default true */
  once?: boolean;
  /** Rendered element. @default "span" */
  as?: React.ElementType;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "prefix">;

/**
 * Scroll-triggered numeric count-up, driven by GSAP rather than a second
 * animation library.
 *
 * Digits are always formatted with the Latin numbering system: Kuwaiti sites
 * conventionally use Western digits (0-9), not Arabic-Indic.
 *
 * The element carries the final value as its `aria-label`, and the animating
 * text is hidden from assistive tech, so screen readers never announce a
 * stream of intermediate numbers.
 *
 * @example
 * <CountUp to={100} suffix="+" className="text-6xl font-bold" />
 */
export function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  grouping = false,
  duration = DURATION.count,
  delay = 0,
  ease = EASE.out,
  trigger = "scroll",
  start = SCROLL_START,
  once = true,
  as,
  className,
  ...rest
}: CountUpProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const Tag = (as ?? "span") as React.ElementType;

  const format = React.useCallback(
    (value: number) =>
      new Intl.NumberFormat("en-US", {
        numberingSystem: "latn",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      }).format(value),
    [decimals, grouping],
  );

  const finalText = `${prefix}${format(to)}${suffix}`;

  useGSAP(
    () =>
      matchMotion({
        motion: () => {
          const element = ref.current;
          if (!element) return;

          const counter = { value: from };
          const write = () => {
            element.textContent = `${prefix}${format(counter.value)}${suffix}`;
          };
          write();

          gsap.to(counter, {
            value: to,
            duration,
            delay,
            ease,
            onUpdate: write,
            onComplete: () => {
              element.textContent = finalText;
            },
            scrollTrigger:
              trigger === "scroll"
                ? { trigger: element, start, once }
                : undefined,
          });
        },
        reduced: () => {
          if (ref.current) ref.current.textContent = finalText;
        },
      }),
    {
      scope: ref,
      dependencies: [
        to,
        from,
        prefix,
        suffix,
        decimals,
        grouping,
        duration,
        delay,
        ease,
        trigger,
        start,
        once,
        finalText,
      ],
    },
  );

  return (
    <Tag
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-label={finalText}
      {...rest}
    >
      {finalText}
    </Tag>
  );
}
