"use client";

import * as React from "react";

import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import {
  DURATION,
  EASE,
  gsap,
  matchMotion,
  useGSAP,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type MobileContactBarProps = {
  /** Contact-page destination — same as the in-page CTA. */
  href: string;
  /** Visible label, e.g. `PropertyDetail.about.contact`. */
  label: string;
  /** Accessible name for the floating CTA. */
  ariaLabel: string;
  /**
   * In-page Contact control. The bar appears once this leaves the viewport
   * and hides when it returns into view.
   */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Force-hide while overlays (lightbox) are open. */
  suppressed?: boolean;
  className?: string;
};

/**
 * Mobile-only floating Contact pill. Slides/fades in with GSAP after the
 * in-page Contact CTA scrolls out of view; respects reduced motion.
 *
 * @param href - Contact page path (e.g. `/contact`).
 * @param label - Button copy from messages.
 * @param ariaLabel - Accessible label including the property title.
 * @param triggerRef - Ref to the in-page Contact control.
 * @param suppressed - When true, keeps the bar hidden (e.g. lightbox open).
 * @example
 * <MobileContactBar
 *   href={ROUTES.contact}
 *   label={t("about.contact")}
 *   ariaLabel={t("about.contactAria", { title: property.title })}
 *   triggerRef={contactTriggerRef}
 *   suppressed={lightboxIndex != null}
 * />
 */
export function MobileContactBar({
  href,
  label,
  ariaLabel,
  triggerRef,
  suppressed = false,
  className,
}: MobileContactBarProps) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const pastTriggerRef = React.useRef(false);
  const suppressedRef = React.useRef(suppressed);
  const syncRef = React.useRef<(instant?: boolean) => void>(() => {});

  useGSAP(
    () => {
      const bar = barRef.current;
      const trigger = triggerRef.current;
      if (!bar || !trigger) return;

      gsap.set(bar, { autoAlpha: 0, y: 28, pointerEvents: "none" });

      return matchMotion({
        motion: (ctx) => {
          const sync = (instant = false) => {
            const visible =
              pastTriggerRef.current &&
              !suppressedRef.current &&
              Boolean(ctx.conditions?.mobile);

            if (instant || !ctx.conditions?.mobile) {
              gsap.set(bar, {
                autoAlpha: visible ? 1 : 0,
                y: visible ? 0 : 28,
                pointerEvents: visible ? "auto" : "none",
              });
              return;
            }

            gsap.to(bar, {
              autoAlpha: visible ? 1 : 0,
              y: visible ? 0 : 28,
              duration: DURATION.fast,
              ease: visible ? EASE.out : EASE.soft,
              pointerEvents: visible ? "auto" : "none",
              overwrite: "auto",
            });
          };

          syncRef.current = sync;

          if (!ctx.conditions?.mobile) {
            sync(true);
            return;
          }

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (!entry) return;
              pastTriggerRef.current = !entry.isIntersecting;
              sync();
            },
            { threshold: 0 },
          );

          observer.observe(trigger);
          sync(true);

          return () => {
            observer.disconnect();
            syncRef.current = () => {};
          };
        },
        reduced: (ctx) => {
          const sync = () => {
            const visible =
              pastTriggerRef.current &&
              !suppressedRef.current &&
              Boolean(ctx.conditions?.mobile);

            gsap.set(bar, {
              autoAlpha: visible ? 1 : 0,
              y: 0,
              pointerEvents: visible ? "auto" : "none",
            });
          };

          syncRef.current = sync;

          if (!ctx.conditions?.mobile) {
            sync();
            return;
          }

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (!entry) return;
              pastTriggerRef.current = !entry.isIntersecting;
              sync();
            },
            { threshold: 0 },
          );

          observer.observe(trigger);
          sync();

          return () => {
            observer.disconnect();
            syncRef.current = () => {};
          };
        },
      });
    },
    { dependencies: [triggerRef] },
  );

  React.useEffect(() => {
    suppressedRef.current = suppressed;
    syncRef.current(true);
  }, [suppressed]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-30 md:hidden",
        className,
      )}
      aria-hidden={suppressed || undefined}
    >
      <div
        className={cn(
          "flex justify-center px-4 pt-2",
          "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
        )}
      >
        <div ref={barRef} className="w-full max-w-xs will-change-transform">
          <Button
            asChild
            variant="primary"
            size="pill"
            className="w-full shadow-md"
          >
            <HapticLink
              href={href}
              aria-label={ariaLabel}
              tabIndex={suppressed ? -1 : undefined}
              haptics={false}
            >
              {label}
            </HapticLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
