"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * GSAP is the only animation engine in this project. Plugins are registered
 * exactly once, here, and every consumer imports `gsap` from this module so
 * registration is guaranteed to have run.
 *
 * All plugins are free as of GSAP 3.13 — no auth token, no private registry.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip };

/** Shared easing vocabulary. Prefer these over ad-hoc strings. */
export const EASE = {
  /** Default entrance. */
  out: "power3.out",
  /** Editorial, long-tail entrance for headlines. */
  expo: "expo.out",
  /** Short UI feedback. */
  soft: "power2.out",
  /** Bidirectional transitions (Flip, active pills). */
  inOut: "power3.inOut",
} as const;

/** Shared duration vocabulary, in seconds. */
export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  count: 1.6,
} as const;

/**
 * Default ScrollTrigger start for entrance animations. `clamp()` keeps the
 * start within the scrollable range, so sections at the very bottom of a short
 * page (e.g. the CTA band above the footer) still play.
 */
export const SCROLL_START = "clamp(top 85%)";

/**
 * Media queries handed to `gsap.matchMedia()`.
 *
 * Every animation in the app must be registered through `matchMedia` with a
 * `reduced` branch, so `prefers-reduced-motion: reduce` collapses it to the
 * final state instantly instead of merely shortening it.
 */
export const MOTION_QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  hover: "(hover: hover) and (pointer: fine)",
  mobile: "(max-width: 767px)",
  desktop: "(min-width: 768px)",
} as const;

export type MotionConditions = {
  motion: boolean;
  reduced: boolean;
  hover: boolean;
  mobile: boolean;
  desktop: boolean;
};

/** `true` when the nearest ancestor resolves to a right-to-left direction. */
export function isRtl(element?: Element | null): boolean {
  if (typeof window === "undefined") return true;
  const target = element ?? document.documentElement;
  return getComputedStyle(target).direction === "rtl";
}

/**
 * `-1` in RTL, `1` in LTR.
 *
 * Multiply any horizontal offset by this instead of hardcoding a sign, so a
 * tween authored as "enters from the inline start" stays correct in both
 * directions.
 */
export function directionSign(element?: Element | null): 1 | -1 {
  return isRtl(element) ? -1 : 1;
}

/**
 * Convert a *logical* horizontal offset into a physical `x` value.
 *
 * A positive `value` always means "further along the inline start side",
 * i.e. right in RTL and left in LTR.
 *
 * @example
 * gsap.from(el, { x: rtlX(40) }) // slides in from the inline start
 */
export function rtlX(value: number, element?: Element | null): number {
  return value * directionSign(element);
}

/** Snapshot of the user's motion preference. Prefer `matchMedia` branches. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_QUERIES.reduced).matches;
}

/**
 * Map a logical entrance direction to the tween's from-vars.
 *
 * @param from - `"start"`/`"end"` are inline-relative and RTL-aware;
 *   `"top"`/`"bottom"` are block-relative; `"none"` fades only.
 * @param distance - Travel distance in pixels.
 */
export function offsetFor(
  from: "top" | "bottom" | "start" | "end" | "none",
  distance: number,
  element?: Element | null,
): { x?: number; y?: number } {
  switch (from) {
    case "top":
      return { y: -distance };
    case "bottom":
      return { y: distance };
    case "start":
      return { x: rtlX(distance, element) };
    case "end":
      return { x: rtlX(-distance, element) };
    case "none":
    default:
      return {};
  }
}

export type MatchMediaBranches = {
  /** Runs when the user has not asked for reduced motion. */
  motion: (context: gsap.Context & { conditions?: MotionConditions }) => void;
  /**
   * Runs when `prefers-reduced-motion: reduce` is set. Must put the UI in its
   * final, readable state immediately — never a shortened animation.
   */
  reduced?: (context: gsap.Context & { conditions?: MotionConditions }) => void;
};

/**
 * Register both motion branches against a single `gsap.matchMedia()`.
 *
 * Call this from inside `useGSAP`, and return the result so the context is
 * reverted on unmount.
 *
 * @example
 * useGSAP(() => matchMotion({
 *   motion: () => { gsap.from(ref.current, { y: 24, opacity: 0 }); },
 *   reduced: () => { gsap.set(ref.current, { clearProps: "all" }); },
 * }), { scope: ref });
 */
export function matchMotion({ motion, reduced }: MatchMediaBranches) {
  const mm = gsap.matchMedia();

  mm.add(MOTION_QUERIES, (context) => {
    const conditions = context.conditions as MotionConditions | undefined;
    if (conditions?.reduced) {
      return reduced?.(
        context as gsap.Context & { conditions?: MotionConditions },
      );
    }
    return motion(context as gsap.Context & { conditions?: MotionConditions });
  });

  return () => mm.revert();
}

/**
 * Resolve once web fonts are ready, or after `timeout` ms — whichever is
 * first. SplitText line splitting is layout-dependent, so Arabic text must not
 * be split before Cairo has loaded; the timeout guarantees we never leave
 * content hidden if the font never resolves.
 */
export function fontsReady(timeout = 2500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ]);
}
