"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  DURATION,
  EASE,
  SCROLL_START,
  gsap,
  matchMotion,
  offsetFor,
  useGSAP,
} from "@/lib/gsap";

/** Logical entrance direction. `start`/`end` are RTL-aware. */
export type RevealFrom = "top" | "bottom" | "start" | "end" | "none";

export type RevealProps = {
  children: React.ReactNode;
  /** Rendered element. Defaults to `div`. */
  as?: React.ElementType;
  className?: string;
  /**
   * Direction the element travels *from*.
   * `start` = inline start (right in RTL), `end` = inline end.
   * @default "bottom"
   */
  from?: RevealFrom;
  /** Travel distance in pixels. @default 28 */
  distance?: number;
  /** Initial opacity. @default 0 */
  opacity?: number;
  /** Initial scale. Omit for no scaling. */
  scale?: number;
  /** Seconds. @default DURATION.base (0.7) */
  duration?: number;
  /** Seconds. @default 0 */
  delay?: number;
  /** GSAP ease string. @default EASE.out */
  ease?: string;
  /**
   * `"scroll"` waits for the element to enter the viewport,
   * `"mount"` plays immediately.
   * @default "scroll"
   */
  trigger?: "scroll" | "mount";
  /** ScrollTrigger `start`. @default "clamp(top 85%)" */
  start?: string;
  /** Replay every time the element re-enters. @default true (play once) */
  once?: boolean;
  /** Show ScrollTrigger markers while debugging. */
  markers?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Fade-and-travel entrance for a single element.
 *
 * Honours `prefers-reduced-motion`: the reduced branch renders the final state
 * with no tween at all.
 *
 * @example
 * <Reveal from="start" delay={0.1}>
 *   <SectionHeader ... />
 * </Reveal>
 */
export function Reveal({
  children,
  as,
  className,
  from = "bottom",
  distance = 28,
  opacity = 0,
  scale,
  duration = DURATION.base,
  delay = 0,
  ease = EASE.out,
  trigger = "scroll",
  start = SCROLL_START,
  once = true,
  markers = false,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const Tag = (as ?? "div") as React.ElementType;

  useGSAP(
    () =>
      matchMotion({
        motion: () => {
          const element = ref.current;
          if (!element) return;

          gsap.from(element, {
            ...offsetFor(from, distance, element),
            autoAlpha: opacity,
            scale,
            duration,
            delay,
            ease,
            scrollTrigger:
              trigger === "scroll"
                ? {
                    trigger: element,
                    start,
                    once,
                    markers,
                    toggleActions: once
                      ? "play none none none"
                      : "play none none reverse",
                  }
                : undefined,
          });
        },
        reduced: () => {
          if (ref.current) gsap.set(ref.current, { clearProps: "all" });
        },
      }),
    {
      scope: ref,
      dependencies: [
        from,
        distance,
        opacity,
        scale,
        duration,
        delay,
        ease,
        trigger,
        start,
        once,
        markers,
      ],
    },
  );

  return (
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
