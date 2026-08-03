"use client";

import { Lens } from "@/components/ui/lens";
import { SmartImage } from "@/components/common/smart-image";
import type { Service } from "@/features/services/types";
import { hasImageSrc } from "@/lib/api/media";
import { cn } from "@/lib/utils";

export type ServiceCardProps = {
  service: Service;
  /**
   * `card` — compact grid tile (home).
   * `row` — full-width listing row (services page).
   * @default "card"
   */
  variant?: "card" | "row";
  className?: string;
};

/**
 * Reusable service card: image at the inline start, title + description at
 * the inline end. Under `dir="rtl"` the browser places the image on the right
 * without any reverse helpers. Stacks on very narrow screens.
 *
 * @param service - Typed service from the data layer.
 * @param variant - Layout density for grid vs listing.
 *
 * @example
 * <ServiceCard service={service} />
 * <ServiceCard service={service} variant="row" />
 */
export function ServiceCard({
  service,
  variant = "card",
  className,
}: ServiceCardProps) {
  const isRow = variant === "row";

  return (
    <article
      data-card
      className={cn(
        "group flex h-full flex-col overflow-hidden sm:flex-row",
        isRow
          ? "rounded-card bg-muted shadow-sm"
          : "rounded-card bg-muted/40",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden",
          isRow
            ? "aspect-5/4 sm:aspect-auto sm:min-h-56 sm:w-[min(38%,18rem)] sm:self-stretch md:min-h-64 md:w-[min(36%,20rem)] xl:min-h-72 xl:w-[min(34%,22rem)]"
            : "aspect-5/4 sm:aspect-auto sm:w-[min(42%,12rem)] sm:self-stretch md:w-[min(44%,14rem)]",
        )}
      >
        {hasImageSrc(service.image) ? (
          <Lens className="absolute inset-0 size-full">
            <SmartImage
              src={service.image.src}
              alt={service.image.alt || service.title}
              fill
              blurDataURL={service.image.blurDataURL}
              sizes={
                isRow
                  ? "(max-width: 640px) 100vw, (max-width: 1280px) 36vw, 22rem"
                  : "(max-width: 640px) 100vw, (max-width: 768px) 42vw, 14rem"
              }
              className="object-cover"
            />
          </Lens>
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden="true" />
        )}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center",
          isRow
            ? "gap-3.5 px-6 py-10 md:gap-4 md:px-8 md:py-12 xl:px-10 xl:py-14"
            : "gap-2.5 p-5 md:gap-3 md:p-6 xl:p-7",
        )}
      >
        <h3
          className={cn(
            "font-bold text-balance text-ink",
            isRow
              ? "text-xl md:text-2xl xl:text-3xl"
              : "text-lg md:text-xl xl:text-2xl",
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            "leading-relaxed text-pretty text-ink-muted",
            isRow ? "text-base md:text-lg" : "text-sm md:text-base",
          )}
        >
          {service.description}
        </p>
      </div>
    </article>
  );
}
