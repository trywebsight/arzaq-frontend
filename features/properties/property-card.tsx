"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronRight, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { hasImageSrc } from "@/lib/api/media";
import type { Property } from "@/features/properties/types";
import { HapticCard } from "@/components/common/haptic-card";
import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import { Lens } from "@/components/ui/lens";

export type PropertyCardProps = {
  /** Listing to render. Fully drives chips, copy and contact actions. */
  property: Property;
  className?: string;
};

function formatLatn(value: number): string {
  return new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
  }).format(value);
}

/**
 * Reusable property listing card — image with hover zoom, chip row, excerpt
 * and detail / phone / WhatsApp actions.
 *
 * Root is `h-full flex flex-col` so grid rows stretch to equal height; the
 * action footer uses `mt-auto` so footers align across the row.
 *
 * @param property - Typed listing from the properties feature.
 * @example
 * <PropertyCard property={property} />
 */
export function PropertyCard({ property, className }: PropertyCardProps) {
  const t = useTranslations("Properties");
  const href = `/properties/${property.slug}`;

  const priceLabel =
    property.price === null
      ? t("card.priceOnRequest")
      : t("card.price", { price: formatLatn(property.price) });

  const chips = [
    property.kindLabel,
    property.district || property.city,
    t("card.area", { area: formatLatn(property.area) }),
    priceLabel,
  ];

  return (
    <HapticCard
      href={href}
      linkLabel={t("card.viewMoreAria", { title: property.title })}
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-border bg-card shadow-xs",
        className,
      )}
      data-card
    >
      <div className="relative z-1 aspect-16/10 w-full shrink-0 overflow-hidden rounded-media bg-muted">
        <HapticLink
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          haptics={false}
          className="absolute inset-0 block size-full"
        >
          {hasImageSrc(property.image) ? (
            <Lens className="block size-full min-h-0">
              <Image
                src={property.image.src}
                alt={property.image.alt || property.title}
                width={property.image.width}
                height={property.image.height}
                className="size-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </Lens>
          ) : (
            <div className="size-full bg-muted" aria-hidden="true" />
          )}
        </HapticLink>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-5 md:p-6">
        <ul className="flex max-h-16 shrink-0 flex-wrap gap-2 overflow-hidden">
          {chips.map((chip) => (
            <li
              key={chip}
              className="max-w-full truncate rounded-full border border-border px-3 py-1 text-xs font-medium text-ink-muted"
            >
              {chip}
            </li>
          ))}
        </ul>

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-lg font-bold text-balance text-ink md:text-xl">
            {property.title}
          </h3>
          <p className="line-clamp-3 text-sm/relaxed text-pretty text-ink-muted md:text-base ">
            {property.excerpt}
          </p>
        </div>

        <div className="mt-auto flex shrink-0 items-center justify-between gap-3 pt-1">
          <HapticLink
            href={href}
            aria-label={t("card.viewMoreAria", { title: property.title })}
            className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("card.viewMore")}
            <ChevronRight
              aria-hidden="true"
              className="size-4 rtl:-scale-x-100"
            />
          </HapticLink>

          <div className="relative z-10 flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon-pill-sm"
              aria-label={t("card.callAria", { title: property.title })}
            >
              <a href={property.contact.phoneHref}>
                <Phone aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon-pill-sm"
              aria-label={t("card.whatsappAria", { title: property.title })}
            >
              <a
                href={property.contact.whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </HapticCard>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
