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
import type { RevealFrom } from "@/components/motion/reveal";

export type StaggerGroupProps = {
  children: React.ReactNode;
  /** Rendered element. Defaults to `div`. */
  as?: React.ElementType;
  className?: string;
  /**
   * CSS selector for the animated items, scoped to this group.
   * Defaults to the group's direct children.
   */
  selector?: string;
  /** Logical entrance direction. @default "bottom" */
  from?: RevealFrom;
  /** Travel distance in pixels. @default 32 */
  distance?: number;
  /** Initial opacity. @default 0 */
  opacity?: number;
  /** Initial scale. Omit for no scaling. */
  scale?: number;
  /** Seconds between items. @default 0.12 */
  stagger?: number;
  /** Seconds. @default DURATION.base (0.7) */
  duration?: number;
  /** Seconds before the first item. @default 0 */
  delay?: number;
  /** GSAP ease string. @default EASE.out */
  ease?: string;
  /** @default "scroll" */
  trigger?: "scroll" | "mount";
  /** ScrollTrigger `start`. @default "clamp(top 85%)" */
  start?: string;
  /** @default true */
  once?: boolean;
  markers?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Staggered entrance for a list of sibling elements — card grids, chip rows,
 * nav items.
 *
 * By default every direct child animates. Pass `selector` when the children
 * are wrapped (for example `selector="[data-card]"`).
 *
 * @example
 * <StaggerGroup className="grid gap-6 md:grid-cols-3" stagger={0.1}>
 *   {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
 * </StaggerGroup>
 */
export function StaggerGroup({
  children,
  as,
  className,
  selector,
  from = "bottom",
  distance = 32,
  opacity = 0,
  scale,
  stagger = 0.12,
  duration = DURATION.base,
  delay = 0,
  ease = EASE.out,
  trigger = "scroll",
  start = SCROLL_START,
  once = true,
  markers = false,
  ...rest
}: StaggerGroupProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const Tag = (as ?? "div") as React.ElementType;

  useGSAP(
    () =>
      matchMotion({
        motion: () => {
          const container = ref.current;
          if (!container) return;

          const items = selector
            ? Array.from(container.querySelectorAll<HTMLElement>(selector))
            : Array.from(container.children).filter(
                (node): node is HTMLElement => node instanceof HTMLElement,
              );

          if (items.length === 0) return;

          const tween = gsap.from(items, {
            ...offsetFor(from, distance, container),
            autoAlpha: opacity,
            scale,
            duration,
            delay,
            ease,
            stagger,
            clearProps: "transform",
            scrollTrigger:
              trigger === "scroll"
                ? {
                    trigger: container,
                    start,
                    once,
                    markers,
                    toggleActions: once
                      ? "play none none none"
                      : "play none none reverse",
                  }
                : undefined,
          });

          // matchMedia may revert mid-stagger (viewport/hover condition flips).
          // Always land on a clean final state so equal-height card grids stay aligned.
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(items, { clearProps: "transform,opacity,visibility" });
          };
        },
        reduced: () => {
          const container = ref.current;
          if (!container) return;
          const items = selector
            ? Array.from(container.querySelectorAll<HTMLElement>(selector))
            : Array.from(container.children);
          gsap.set(items, { clearProps: "all" });
        },
      }),
    {
      scope: ref,
      dependencies: [
        selector,
        from,
        distance,
        opacity,
        scale,
        stagger,
        duration,
        delay,
        ease,
        trigger,
        start,
        once,
        markers,
        React.Children.count(children),
      ],
    },
  );

  return (
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
