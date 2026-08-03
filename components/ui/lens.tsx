"use client";

import * as React from "react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";
import { DURATION, EASE, MOTION_QUERIES, gsap, useGSAP } from "@/lib/gsap";

type Position = {
  x: number;
  y: number;
};

export type LensProps = {
  children: React.ReactNode;
  /** Magnification inside the lens. Must be > 1. @default 1.35 */
  zoomFactor?: number;
  /** Lens diameter in CSS pixels. @default 170 */
  lensSize?: number;
  /** Forced lens centre when `isStatic` is set. */
  position?: Position;
  /** Resting centre while not hovering (keeps the lens visible). */
  defaultPosition?: Position;
  /** Keep the lens visible without hover. @default false */
  isStatic?: boolean;
  /** Enter/exit tween duration in seconds. @default 0.15 */
  duration?: number;
  /** Mask colour used by the radial reveal. @default "black" */
  lensColor?: string;
  /**
   * Optional accessible name. Prefer omitting — the lens is a decorative
   * hover affordance; the underlying image or link should carry the name.
   */
  ariaLabel?: string;
  className?: string;
  /**
   * Force the magnifier on/off. When omitted, enables only for
   * `md+` viewports with a fine hover pointer and no reduced-motion preference.
   */
  enabled?: boolean;
};

/** Desktop + fine pointer + motion allowed — touch devices stay plain images. */
const LENS_MEDIA_QUERY = `${MOTION_QUERIES.desktop} and ${MOTION_QUERIES.hover} and ${MOTION_QUERIES.motion}`;

const DEFAULT_LENS_POSITION: Position = { x: 0, y: 0 };

function subscribeLensMedia(onStoreChange: () => void) {
  const mq = window.matchMedia(LENS_MEDIA_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getLensMediaSnapshot() {
  return window.matchMedia(LENS_MEDIA_QUERY).matches;
}

function getLensMediaServerSnapshot() {
  return false;
}

function useLensMediaEnabled(): boolean {
  return useSyncExternalStore(
    subscribeLensMedia,
    getLensMediaSnapshot,
    getLensMediaServerSnapshot,
  );
}

/**
 * Hover magnifier for content images (Magic UI Lens, ported to GSAP).
 *
 * Desktop / fine-pointer only by default — on touch and below `md` the
 * component is a plain overflow-hidden wrapper. Enter/exit uses GSAP so this
 * file never imports `motion` / framer-motion.
 *
 * @example
 * <Lens className="size-full rounded-media">
 *   <Image src={…} alt={…} fill className="object-cover" />
 * </Lens>
 */
export function Lens({
  children,
  zoomFactor = 1.35,
  lensSize = 170,
  isStatic = false,
  position = DEFAULT_LENS_POSITION,
  defaultPosition,
  duration = 0.15,
  lensColor = "black",
  ariaLabel,
  className,
  enabled: enabledProp,
}: LensProps) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1");
  }
  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0");
  }

  const mediaEnabled = useLensMediaEnabled();
  const enabled = enabledProp ?? mediaEnabled;

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState<Position>(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const currentPosition = isStatic
    ? position
    : defaultPosition && !isHovering
      ? defaultPosition
      : mousePosition;

  const showLens =
    enabled && (isStatic || Boolean(defaultPosition) || isHovering);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [enabled],
  );

  useGSAP(
    () => {
      const lens = lensRef.current;
      const zoom = zoomRef.current;
      if (!lens || !showLens) return;

      const { x, y } = currentPosition;
      const mask = `radial-gradient(circle ${lensSize / 2}px at ${x}px ${y}px, ${lensColor} 100%, transparent 100%)`;

      gsap.set(lens, {
        maskImage: mask,
        webkitMaskImage: mask,
        transformOrigin: `${x}px ${y}px`,
      });

      if (zoom) {
        gsap.set(zoom, {
          scale: zoomFactor,
          transformOrigin: `${x}px ${y}px`,
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [
        currentPosition.x,
        currentPosition.y,
        lensSize,
        lensColor,
        zoomFactor,
        showLens,
      ],
    },
  );

  useGSAP(
    () => {
      const lens = lensRef.current;
      if (!lens || !enabled || isStatic || defaultPosition) return;

      if (isHovering) {
        gsap.fromTo(
          lens,
          { opacity: 0, scale: 0.58 },
          {
            opacity: 1,
            scale: 1,
            duration: Math.min(duration, DURATION.fast),
            ease: EASE.soft,
            overwrite: true,
          },
        );
        return;
      }

      gsap.to(lens, {
        opacity: 0,
        scale: 0.8,
        duration: Math.min(duration, DURATION.fast),
        ease: EASE.soft,
        overwrite: true,
      });
    },
    {
      scope: containerRef,
      dependencies: [isHovering, enabled, isStatic, defaultPosition, duration],
    },
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={enabled ? () => setIsHovering(true) : undefined}
      onMouseLeave={
        enabled
          ? () => {
              setIsHovering(false);
            }
          : undefined
      }
      onMouseMove={enabled ? handleMouseMove : undefined}
      onKeyDown={
        enabled && ariaLabel
          ? (event) => {
              if (event.key === "Escape") setIsHovering(false);
            }
          : undefined
      }
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      tabIndex={ariaLabel ? 0 : undefined}
    >
      {children}
      {showLens ? (
        <div
          ref={lensRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{
            opacity: isStatic || defaultPosition ? 1 : 0,
          }}
        >
          <div ref={zoomRef} className="absolute inset-0">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
