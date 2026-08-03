"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ImageAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/common/smart-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDirection } from "@/components/ui/direction";

export type ImageLightboxProps = {
  /** Ordered images to browse. */
  images: ImageAsset[];
  /**
   * Controlled open index. `null` keeps the lightbox closed.
   */
  index: number | null;
  /** Called when the lightbox should close. */
  onClose: () => void;
  /** Called when the active index changes (prev/next). */
  onIndexChange?: (index: number) => void;
  /** Fallback alt when an asset has no alt. */
  altFallback?: string;
  className?: string;
};

/**
 * Full-viewport image spotlight with prev/next, Escape/backdrop/X close,
 * focus trap and scroll lock via Dialog.
 *
 * @param images - Gallery assets to browse.
 * @param index - Active image index, or `null` when closed.
 * @example
 * <ImageLightbox
 *   images={gallery}
 *   index={openIndex}
 *   onClose={() => setOpenIndex(null)}
 *   onIndexChange={setOpenIndex}
 * />
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  altFallback,
  className,
}: ImageLightboxProps) {
  const t = useTranslations("ImageLightbox");
  const direction = useDirection();
  const open = index !== null && images.length > 0;
  const activeIndex = open ? Math.min(Math.max(index, 0), images.length - 1) : 0;
  const active = images[activeIndex];
  const multi = images.length > 1;

  const showPrev = () => {
    if (images.length === 0) return;
    const next =
      ((activeIndex - 1) % images.length + images.length) % images.length;
    onIndexChange?.(next);
  };

  const showNext = () => {
    if (images.length === 0) return;
    const next = (activeIndex + 1) % images.length;
    onIndexChange?.(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!multi) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const towardsStart =
      direction === "rtl"
        ? event.key === "ArrowRight"
        : event.key === "ArrowLeft";
    if (towardsStart) showPrev();
    else showNext();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        fullscreen
        showCloseButton={false}
        onKeyDown={handleKeyDown}
        onPointerDownOutside={() => onClose()}
        className={cn(
          "bg-black/92 text-white supports-backdrop-filter:backdrop-blur-sm",
          className,
        )}
      >
        <DialogTitle className="sr-only">{t("dialog")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("counter", {
            current: activeIndex + 1,
            total: images.length,
          })}
        </DialogDescription>

        <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:px-6 md:py-4">
          <p className="text-sm font-medium text-white/80 tabular-nums">
            {t("counter", {
              current: activeIndex + 1,
              total: images.length,
            })}
          </p>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-pill"
              aria-label={t("close")}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div
          className="relative min-h-0 flex-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          {multi ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-pill"
              aria-label={t("previous")}
              onClick={showPrev}
              className="absolute inset-s-1 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:inset-s-2 md:inset-s-4"
            >
              <ChevronLeft
                className="size-6 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </Button>
          ) : null}

          {active ? (
            <div className="absolute inset-0 px-12 md:px-16">
              <div className="relative size-full">
                <SmartImage
                  key={active.src}
                  src={active.src}
                  alt={active.alt || altFallback || t("dialog")}
                  fill
                  priority
                  blurDataURL={active.blurDataURL}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
          ) : null}

          {multi ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-pill"
              aria-label={t("next")}
              onClick={showNext}
              className="absolute inset-e-1 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:inset-e-2 md:inset-e-4"
            >
              <ChevronRight
                className="size-6 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
