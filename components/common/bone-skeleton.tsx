"use client";

import * as React from "react";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

import { cn } from "@/lib/utils";

export type BoneSkeletonProps = {
  /**
   * Stable identifier. `pnpm exec boneyard-js build` writes
   * `bones/<name>.bones.json` for it and the registry resolves it at runtime.
   * Use kebab-case, one per distinct card/layout.
   */
  name: string;
  /** Show the skeleton instead of `children`. */
  loading: boolean;
  /**
   * Hand-written Tailwind placeholder. **Required.**
   *
   * Bones have not been captured yet — the capture runs at the very end of the
   * project, against finished markup — so this is what users actually see
   * today. It must look correct on its own, at every breakpoint.
   */
  fallback: React.ReactNode;
  /** Real content, rendered when `loading` is false. */
  children: React.ReactNode;
  /**
   * Mock content rendered only while the CLI captures bones, for components
   * whose data cannot resolve during the capture window.
   */
  fixture?: React.ReactNode;
  /** @default "pulse" */
  animate?: "pulse" | "shimmer" | "solid";
  /** Delay between bones, in ms. `true` uses 80ms. @default false */
  stagger?: number | boolean;
  /** Fade-out duration in ms when loading ends. `true` uses 300ms. */
  transition?: number | boolean;
  className?: string;
};

/**
 * Skeleton wrapper around boneyard-js.
 *
 * Until bones are captured, boneyard renders `fallback` verbatim, so treat
 * `fallback` as the real skeleton and the captured bones as a later upgrade.
 *
 * @example
 * <BoneSkeleton
 *   name="property-card-grid"
 *   loading={isPending}
 *   fallback={
 *     <div className="grid gap-6 md:grid-cols-3">
 *       {Array.from({ length: 3 }).map((_, i) => (
 *         <div key={i} className="space-y-4">
 *           <div className="aspect-video w-full rounded-media bg-muted animate-pulse" />
 *           <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
 *         </div>
 *       ))}
 *     </div>
 *   }
 * >
 *   {grid}
 * </BoneSkeleton>
 */
export function BoneSkeleton({
  name,
  loading,
  fallback,
  children,
  fixture,
  animate = "pulse",
  stagger = false,
  transition,
  className,
}: BoneSkeletonProps) {
  return (
    <BoneyardSkeleton
      name={name}
      loading={loading}
      fallback={fallback}
      fixture={fixture}
      animate={animate}
      stagger={stagger}
      transition={transition}
      color="var(--muted)"
      className={cn("w-full", className)}
    >
      {children}
    </BoneyardSkeleton>
  );
}
