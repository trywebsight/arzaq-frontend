"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EASE, MOTION_QUERIES, gsap, useGSAP } from "@/lib/gsap";

export type MagneticProps = {
  children: React.ReactNode;
  /** Rendered element. @default "span" (rendered `inline-block`) */
  as?: React.ElementType;
  className?: string;
  /**
   * How far the element follows the pointer, as a fraction of the pointer's
   * offset from the element centre. @default 0.3
   */
  strength?: number;
  /** Extra hit area around the element, in pixels. @default 24 */
  padding?: number;
  /** Maximum travel in pixels, in each axis. @default 18 */
  max?: number;
  /** Scale applied while the pointer is inside the hit area. Omit to skip. */
  hoverScale?: number;
  /** Turn the effect off without unmounting. @default false */
  disabled?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">;

/**
 * Pointer-following "magnetic" hover for buttons and icon actions.
 *
 * The effect is registered only for `(hover: hover) and (pointer: fine)` and
 * only when the user has not requested reduced motion, so touch devices and
 * motion-sensitive users get a plain, static control.
 *
 * Direction-agnostic by construction: the transform is derived from the
 * pointer's offset, so nothing needs mirroring in RTL.
 *
 * @example
 * <Magnetic max={12}>
 *   <Button variant="primary">{t("cta")}</Button>
 * </Magnetic>
 */
export function Magnetic({
  children,
  as,
  className,
  strength = 0.3,
  padding = 24,
  max = 18,
  hoverScale,
  disabled = false,
  ...rest
}: MagneticProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const Tag = (as ?? "span") as React.ElementType;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || disabled) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: MOTION_QUERIES.motion,
          hover: MOTION_QUERIES.hover,
        },
        (context) => {
          const conditions = context.conditions as
            | { motion: boolean; hover: boolean }
            | undefined;
          if (!conditions?.motion || !conditions.hover) return;

          const quickX = gsap.quickTo(element, "x", {
            duration: 0.5,
            ease: EASE.soft,
          });
          const quickY = gsap.quickTo(element, "y", {
            duration: 0.5,
            ease: EASE.soft,
          });

          const onPointerMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            const withinX =
              event.clientX >= rect.left - padding &&
              event.clientX <= rect.right + padding;
            const withinY =
              event.clientY >= rect.top - padding &&
              event.clientY <= rect.bottom + padding;

            if (!withinX || !withinY) {
              quickX(0);
              quickY(0);
              return;
            }

            const offsetX = event.clientX - (rect.left + rect.width / 2);
            const offsetY = event.clientY - (rect.top + rect.height / 2);
            quickX(gsap.utils.clamp(-max, max, offsetX * strength));
            quickY(gsap.utils.clamp(-max, max, offsetY * strength));
          };

          const reset = () => {
            quickX(0);
            quickY(0);
            if (hoverScale) {
              gsap.to(element, { scale: 1, duration: 0.4, ease: EASE.soft });
            }
          };

          const onEnter = () => {
            if (hoverScale) {
              gsap.to(element, {
                scale: hoverScale,
                duration: 0.4,
                ease: EASE.soft,
              });
            }
          };

          window.addEventListener("pointermove", onPointerMove, {
            passive: true,
          });
          element.addEventListener("pointerenter", onEnter);
          element.addEventListener("pointerleave", reset);
          element.addEventListener("blur", reset, true);

          return () => {
            window.removeEventListener("pointermove", onPointerMove);
            element.removeEventListener("pointerenter", onEnter);
            element.removeEventListener("pointerleave", reset);
            element.removeEventListener("blur", reset, true);
            gsap.set(element, { x: 0, y: 0, scale: 1 });
          };
        },
      );

      return () => mm.revert();
    },
    {
      scope: ref,
      dependencies: [strength, padding, max, hoverScale, disabled],
    },
  );

  return (
    <Tag ref={ref} className={cn("inline-block will-change-transform", className)} {...rest}>
      {children}
    </Tag>
  );
}
