"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import type { ImageAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Lens } from "@/components/ui/lens";

export type PropertyGalleryProps = {
  /** Images to display (hero + gallery, deduped upstream). */
  images: ImageAsset[];
  /** Shared alt fallback when an asset has no alt. */
  altFallback: string;
  /** Opens the spotlight at the given index. */
  onOpen: (index: number) => void;
  /** Accessible name for the gallery region. */
  label: string;
  className?: string;
};

/**
 * Property photo gallery. Embla carousel with a mobile peek; on `md+` each
 * slide is half-width so two images sit side-by-side when they fit.
 *
 * @param images - Ordered gallery assets.
 * @param onOpen - Click handler that receives the image index.
 * @example
 * <PropertyGallery
 *   images={gallery}
 *   altFallback={property.title}
 *   label={t("gallery.label")}
 *   onOpen={setLightboxIndex}
 * />
 */
export function PropertyGallery({
  images,
  altFallback,
  onOpen,
  label,
  className,
}: PropertyGalleryProps) {
  const t = useTranslations("PropertyDetail.gallery");

  if (images.length === 0) return null;

  const showControls = images.length > 1;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
        skipSnaps: false,
        dragFree: false,
        containScroll: "trimSnaps",
        duration: 28,
      }}
      className={cn("w-full", className)}
      aria-label={label}
    >
      <CarouselContent className="-ms-4 md:-ms-6">
        {images.map((asset, index) => (
          <CarouselItem
            key={`${asset.src}-${index}`}
            className="ps-4 basis-[85%] sm:basis-[70%] md:basis-1/2 md:ps-6"
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={t("openImage", {
                index: index + 1,
                total: images.length,
              })}
              className="relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-media focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Lens className="absolute inset-0 size-full">
                <Image
                  src={asset.src}
                  alt={asset.alt || altFallback}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 85vw, 50vw"
                />
              </Lens>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showControls ? (
        <div className="mt-4 flex items-center justify-start gap-2.5 md:mt-5">
          <CarouselPrevious
            variant="outline"
            size="icon-pill"
            className="static inset-auto translate-none shadow-xs transition-[transform,box-shadow,opacity] duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
          <CarouselNext
            variant="outline"
            size="icon-pill"
            className="static inset-auto translate-none shadow-xs transition-[transform,box-shadow,opacity] duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        </div>
      ) : null}
    </Carousel>
  );
}
