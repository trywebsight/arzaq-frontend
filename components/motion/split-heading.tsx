"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  DURATION,
  EASE,
  SCROLL_START,
  SplitText,
  fontsReady,
  gsap,
  matchMotion,
  useGSAP,
} from "@/lib/gsap";

/**
 * Split granularity.
 *
 * Character splitting is deliberately not offered: Arabic is a connected
 * script, and wrapping each character in its own inline-block element breaks
 * letter joining (كلمة renders as ك ل م ة). Lines and words are safe because
 * the split happens at whitespace, where letters do not join anyway.
 */
export type SplitHeadingType = "lines" | "words" | "lines, words";

export type SplitHeadingProps = {
  /** Text content. Keep it plain text — nested elements survive, but avoid block children. */
  children: React.ReactNode;
  /** Rendered element. @default "h2" */
  as?: React.ElementType;
  className?: string;
  /** @default "lines" */
  type?: SplitHeadingType;
  /**
   * Which unit gets an `overflow: clip` wrapper, producing the masked wipe.
   * @default "lines"
   */
  mask?: "lines" | "words";
  /** Unit that actually animates. @default matches `mask` */
  target?: "lines" | "words";
  /** Seconds between units. @default 0.09 */
  stagger?: number;
  /** Seconds. @default DURATION.slow (1.1) */
  duration?: number;
  /** Seconds. @default 0 */
  delay?: number;
  /** GSAP ease string. @default EASE.expo */
  ease?: string;
  /** @default "scroll" */
  trigger?: "scroll" | "mount";
  /** ScrollTrigger `start`. @default "top 85%" */
  start?: string;
  /** @default true */
  once?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Pad SplitText mask wrappers so Arabic descenders / dots (بيع, ي, ج, …)
 * are not clipped by `overflow: clip`. Negative margins keep layout rhythm.
 */
function padSplitMasks(split: SplitText) {
  if (!split.masks?.length) return;
  // Generous block padding: Cairo bold descenders (ي، ج، بيع) need ~0.35–0.45em.
  gsap.set(split.masks, {
    paddingBlockStart: "0.28em",
    paddingBlockEnd: "0.42em",
    marginBlockStart: "-0.28em",
    marginBlockEnd: "-0.42em",
  });
}

/**
 * Masked line-by-line headline reveal.
 *
 * Splitting is deferred until web fonts have settled (`document.fonts.ready`,
 * with a safety timeout) and uses `autoSplit`, so Arabic text is never split
 * against a fallback font's line breaks. The tween is created inside
 * `onSplit()` as the GSAP docs require, so re-splits stay in sync.
 *
 * Mask wrappers get block padding so Arabic descenders are not cropped.
 *
 * @example
 * <SplitHeading as="h1" className="text-5xl font-bold">
 *   {t("title")}
 * </SplitHeading>
 */
export function SplitHeading({
  children,
  as,
  className,
  type = "lines",
  mask = "lines",
  target,
  stagger = 0.09,
  duration = DURATION.slow,
  delay = 0,
  ease = EASE.expo,
  trigger = "scroll",
  start = SCROLL_START,
  once = true,
  ...rest
}: SplitHeadingProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const Tag = (as ?? "h2") as React.ElementType;
  const animated = target ?? mask;

  useGSAP(
    () =>
      matchMotion({
        motion: () => {
          const element = ref.current;
          if (!element) return;

          let split: SplitText | undefined;
          let cancelled = false;

          gsap.set(element, { autoAlpha: 0 });

          void fontsReady().then(() => {
            if (cancelled || !ref.current) return;
            gsap.set(element, { autoAlpha: 1 });

            split = SplitText.create(element, {
              type,
              mask,
              autoSplit: true,
              aria: "auto",
              onSplit: (self) => {
                padSplitMasks(self);

                const units = animated === "words" ? self.words : self.lines;
                if (units.length === 0) return;

                return gsap.from(units, {
                  // Slightly over 100% so the wipe still clears the padded mask,
                  // without needing an extreme travel that fights descenders.
                  yPercent: 105,
                  duration,
                  delay,
                  ease,
                  stagger,
                  scrollTrigger:
                    trigger === "scroll"
                      ? {
                          trigger: element,
                          start,
                          once,
                          toggleActions: once
                            ? "play none none none"
                            : "play none none reverse",
                        }
                      : undefined,
                });
              },
            });
          });

          return () => {
            cancelled = true;
            split?.revert();
            if (ref.current) gsap.set(ref.current, { autoAlpha: 1 });
          };
        },
        reduced: () => {
          if (ref.current) gsap.set(ref.current, { autoAlpha: 1 });
        },
      }),
    {
      scope: ref,
      dependencies: [
        type,
        mask,
        animated,
        stagger,
        duration,
        delay,
        ease,
        trigger,
        start,
        once,
      ],
    },
  );

  return (
    <Tag
      ref={ref}
      className={cn(
        // Base leading gives Arabic descenders room; callers may tighten but
        // mask padding in onSplit is the real clip fix.
        "leading-[1.35]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
