"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ImageAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";
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
        showCloseButton={false}
        onKeyDown={handleKeyDown}
        onPointerDownOutside={() => onClose()}
        className={cn(
          "fixed inset-0 z-50 flex h-dvh w-screen max-w-none translate-0 flex-col gap-0 rounded-none border-0 bg-black/92 p-0 text-white shadow-none ring-0 outline-none supports-backdrop-filter:backdrop-blur-sm data-open:zoom-in-100 data-closed:zoom-out-100",
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

        <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
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
          className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 md:px-14 md:pb-8"
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
              className="absolute inset-s-2 z-10 text-white hover:bg-white/10 hover:text-white md:inset-s-4"
            >
              <ChevronLeft
                className="size-6 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </Button>
          ) : null}

          {active ? (
            <div className="relative h-[85dvh] w-[90vw] max-h-[85dvh] max-w-[90vw]">
              <Image
                key={active.src}
                src={active.src}
                alt={active.alt || altFallback || t("dialog")}
                fill
                priority
                className="object-contain"
                sizes="90vw"
              />
            </div>
          ) : null}

          {multi ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-pill"
              aria-label={t("next")}
              onClick={showNext}
              className="absolute inset-e-2 z-10 text-white hover:bg-white/10 hover:text-white md:inset-e-4"
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
