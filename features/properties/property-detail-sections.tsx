"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  House,
  Images,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Share2,
} from "lucide-react";

import type { ImageAsset } from "@/lib/assets";
import type { Property } from "@/features/properties/types";
import { useProperties } from "@/features/properties/hooks";
import { PropertyCard } from "@/features/properties/property-card";
import { HapticLink, SmartImage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptic";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

type DetailT = ReturnType<typeof useTranslations<"PropertyDetail">>;

/** Western digits with grouping, up to 3 decimals (KWD fils). */
export function formatNumber(value: number, maxDecimals = 3): string {
  return new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

const DATE_FORMAT = new Intl.DateTimeFormat("ar-KW-u-nu-latn", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** `2026-07-19` → `19 يوليو 2026`; `null` for missing/invalid input. */
export function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : DATE_FORMAT.format(date);
}

/** Price per m² for sale listings, when both numbers are known. */
export function pricePerMeter(property: Property): number | null {
  if (property.purpose !== "sale") return null;
  if (!property.price || !property.area) return null;
  return Math.round(property.price / property.area);
}

/**
 * Hero photo mosaic: one large photo plus up to two side photos on desktop,
 * a single photo on mobile, and a "view all" button that opens the lightbox.
 *
 * @param images - Ordered photos; index 0 is the cover.
 * @param onOpen - Receives the photo index to open in the lightbox.
 */
export function PropertyHeroMedia({
  images,
  title,
  onOpen,
}: {
  images: ImageAsset[];
  title: string;
  onOpen: (index: number) => void;
}) {
  const t = useTranslations("PropertyDetail");
  const [cover, ...rest] = images;
  const side = rest.slice(0, 2);
  const hiddenCount = images.length - 1 - side.length;

  if (!cover) {
    return (
      <div
        aria-hidden="true"
        className="flex aspect-16/9 w-full items-center justify-center rounded-media bg-muted text-ink-muted"
      >
        <House className="size-10" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid gap-3",
        side.length > 0 && "md:h-112 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:h-128",
      )}
    >
      <MediaTile
        image={cover}
        alt={title}
        priority
        onClick={() => onOpen(0)}
        label={t("gallery.openHero")}
        className={cn(
          "aspect-4/3 md:aspect-auto",
          side.length === 0 && "md:aspect-16/9",
        )}
        sizes="(max-width: 768px) 100vw, min(820px, 62vw)"
      />

      {side.length > 0 ? (
        <div
          className={cn(
            "hidden gap-3 md:grid",
            side.length === 2 ? "grid-rows-2" : "grid-rows-1",
          )}
        >
          {side.map((image, index) => {
            const imageIndex = index + 1;
            const isLast = index === side.length - 1 && hiddenCount > 0;
            return (
              <MediaTile
                key={image.src}
                image={image}
                alt={title}
                onClick={() => onOpen(imageIndex)}
                label={t("gallery.openImage", {
                  index: imageIndex + 1,
                  total: images.length,
                })}
                sizes="(max-width: 1280px) 30vw, 400px"
                overlay={
                  isLast ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-bold text-white">
                      {t("gallery.more", { count: hiddenCount })}
                    </span>
                  ) : null
                }
              />
            );
          })}
        </div>
      ) : null}

      {images.length > 1 ? (
        <Button
          type="button"
          variant="white"
          size="pill-sm"
          onClick={() => onOpen(0)}
          className="absolute end-3 bottom-3 z-10 border border-border shadow-sm"
        >
          <Images aria-hidden="true" className="size-4" />
          {t("gallery.viewAll", { count: images.length })}
        </Button>
      ) : null}
    </div>
  );
}

function MediaTile({
  image,
  alt,
  label,
  onClick,
  sizes,
  priority,
  overlay,
  className,
}: {
  image: ImageAsset;
  alt: string;
  label: string;
  onClick: () => void;
  sizes: string;
  priority?: boolean;
  overlay?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic();
        onClick();
      }}
      aria-label={label}
      className={cn(
        "group relative block size-full cursor-zoom-in overflow-hidden rounded-media bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <SmartImage
        src={image.src}
        alt={image.alt || alt}
        fill
        priority={priority}
        blurDataURL={image.blurDataURL}
        quality={70}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
      />
      {overlay}
    </button>
  );
}

type Fact = {
  key: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
};

/**
 * At-a-glance tiles (type, area, rooms, floors, apartments). Only known values render.
 */
export function PropertyFacts({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  const facts: Fact[] = [
    { key: "type", icon: House, label: t("facts.type"), value: property.kindLabel },
  ];

  if (property.area != null) {
    facts.push({
      key: "area",
      icon: Ruler,
      label: t("facts.area"),
      value: t("about.areaValue", { area: formatNumber(property.area) }),
    });
  }
  if (property.bedrooms != null) {
    facts.push({ key: "rooms", icon: BedDouble, label: t("facts.rooms"), value: formatNumber(property.bedrooms) });
  }
  if (property.floors != null) {
    facts.push({ key: "floors", icon: Layers, label: t("facts.floors"), value: formatNumber(property.floors) });
  }
  if (property.apartments != null) {
    facts.push({ key: "apartments", icon: Building2, label: t("facts.apartments"), value: formatNumber(property.apartments) });
  }

  return (
    <ul
      aria-label={t("facts.label")}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
    >
      {facts.map(({ key, icon: Icon, label, value }) => (
        <li
          key={key}
          className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-xs"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon aria-hidden className="size-4.5" strokeWidth={1.75} />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-ink-muted">{label}</span>
            <span className="text-base font-bold text-ink">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Full specification table in two columns on desktop. Rows without data are skipped.
 */
export function PropertyDetailsList({
  property,
  purposeLabel,
}: {
  property: Property;
  purposeLabel: string;
}) {
  const t = useTranslations("PropertyDetail");
  const rows: Array<[string, string | null | undefined]> = [
    [t("details.code"), property.code],
    [t("details.type"), property.kindLabel],
    [t("details.purpose"), purposeLabel],
    [t("details.condition"), property.condition],
    [t("details.plotPosition"), property.plotPosition],
    [t("details.area"), property.area != null ? t("about.areaValue", { area: formatNumber(property.area) }) : null],
    [t("details.rooms"), property.bedrooms != null ? formatNumber(property.bedrooms) : null],
    [t("details.floors"), property.floors != null ? formatNumber(property.floors) : null],
    [t("details.apartments"), property.apartments != null ? formatNumber(property.apartments) : null],
    [t("details.bathrooms"), property.bathrooms != null ? formatNumber(property.bathrooms) : null],
    [t("details.garage"), property.garage != null ? formatNumber(property.garage) : null],
    [t("details.governorate"), property.governorateLabel],
    [t("details.city"), property.city],
    [t("details.district"), property.district],
    [t("details.published"), formatDate(property.publishedAt)],
    [t("details.updated"), property.updatedAt !== property.publishedAt ? formatDate(property.updatedAt) : null],
  ];

  return (
    <section aria-labelledby="property-details-title">
      <h2 id="property-details-title" className="text-xl font-bold text-ink md:text-2xl">
        {t("details.title")}
      </h2>
      <dl className="mt-4 grid gap-x-10 rounded-card border border-border bg-card px-5 shadow-xs md:grid-cols-2 md:px-6">
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]))
          .map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-border py-3.5 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
            >
              <dt className="text-sm text-ink-muted">{label}</dt>
              <dd className="text-end text-sm font-bold text-ink md:text-base">{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}

/**
 * Income and gross yield for income-producing properties.
 */
export function PropertyInvestment({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  if (!property.monthlyIncome) return null;

  const stats = [
    { key: "monthly", label: t("investment.monthlyIncome"), value: t("price.value", { price: formatNumber(property.monthlyIncome) }) },
    { key: "annual", label: t("investment.annualIncome"), value: t("price.value", { price: formatNumber(property.monthlyIncome * 12) }) },
  ];
  if (property.annualReturn) {
    stats.push({ key: "return", label: t("investment.annualReturn"), value: `${formatNumber(property.annualReturn, 2)}%` });
  }

  return (
    <section aria-labelledby="property-investment-title">
      <h2 id="property-investment-title" className="text-xl font-bold text-ink md:text-2xl">
        {t("investment.title")}
      </h2>
      <div className="mt-4 rounded-card bg-muted p-5 md:p-6">
        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.key} className="rounded-card bg-card p-4 shadow-xs">
              <dt className="text-xs text-ink-muted">{stat.label}</dt>
              <dd className="mt-1 text-lg font-bold text-ink md:text-xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-pretty text-ink-muted">{t("investment.note")}</p>
      </div>
    </section>
  );
}

/**
 * Hosted video tour. QuickTime files also get an `mp4` source so Chromium plays H.264 `.mov` uploads.
 */
export function PropertyVideoTour({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  const video = property.video;
  if (!video?.src) return null;

  return (
    <section aria-labelledby="property-video-title">
      <h2 id="property-video-title" className="text-xl font-bold text-ink md:text-2xl">
        {t("video.title")}
      </h2>
      <div className="mt-4 overflow-hidden rounded-media bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          poster={property.image?.src}
          className="aspect-video w-full"
        >
          <source src={video.src} type={video.type} />
          {video.type === "video/quicktime" ? (
            <source src={video.src} type="video/mp4" />
          ) : null}
          <p className="p-6 text-sm text-white">
            {t("video.unsupported")}{" "}
            <a href={video.src} className="underline" target="_blank" rel="noopener noreferrer">
              {t("video.open")}
            </a>
          </p>
        </video>
      </div>
    </section>
  );
}

/**
 * Property map. Pins the exact property when the office added a map link,
 * otherwise shows the neighbourhood. Kuwait Finder opens the PACI address.
 */
export function PropertyLocationMap({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  const coordinates = property.coordinates;
  const exact = Boolean(property.coordinatesExact && coordinates);
  const place = [property.district, property.city, property.governorateLabel]
    .filter(Boolean)
    .join("، ");

  if (!coordinates && !property.kuwaitFinderUrl) return null;

  const query = coordinates ? `${coordinates.lat},${coordinates.lng}` : null;

  return (
    <section aria-labelledby="property-location-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="property-location-title" className="text-xl font-bold text-ink md:text-2xl">
            {t("location.title")}
          </h2>
          {place ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {place}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {query ? (
            <Button asChild variant="outline" size="pill-sm">
              <HapticLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                external
                haptics={false}
              >
                {t("location.openMap")}
                <ChevronRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </HapticLink>
            </Button>
          ) : null}
          {property.kuwaitFinderUrl ? (
            <Button asChild variant="outline" size="pill-sm">
              <HapticLink href={property.kuwaitFinderUrl} external haptics={false}>
                {t("location.kuwaitFinder")}
                <ChevronRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </HapticLink>
            </Button>
          ) : null}
        </div>
      </div>
      {query ? (
        <>
          <div className="mt-4 overflow-hidden rounded-media border border-border bg-muted">
            <iframe
              title={t("location.mapTitle", { area: property.city || place })}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${exact ? 16 : 14}&hl=ar&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-16/9 w-full md:aspect-21/9"
            />
          </div>
          <p className="mt-2 text-xs text-pretty text-ink-muted">
            {exact ? t("location.exact") : t("location.approximate")}
          </p>
        </>
      ) : null}
    </section>
  );
}

/**
 * Sticky price + contact card. `triggerRef` wraps the primary CTA so the mobile
 * floating bar appears once it scrolls out of view.
 */
export function PropertyContactCard({
  property,
  purposeLabel,
  triggerRef,
}: {
  property: Property;
  purposeLabel: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const t = useTranslations("PropertyDetail");
  const perMeter = pricePerMeter(property);

  return (
    <div className="space-y-5 rounded-card border border-border bg-card p-6 shadow-sm">
      <PropertyPrice
        property={property}
        purposeLabel={purposeLabel}
        perMeter={perMeter}
        t={t}
        className="hidden lg:block"
      />

      <div className="hidden h-px bg-border lg:block" />

      <div className="space-y-1">
        <p className="text-base font-bold text-ink">{t("cta.title")}</p>
        <p className="text-sm text-pretty text-ink-muted">{t("cta.body")}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div ref={triggerRef}>
          <Button asChild variant="primary" size="pill" className="w-full">
            <HapticLink
              href={property.contact.whatsappHref}
              external
              haptics={false}
              aria-label={t("cta.whatsappAria", { title: property.title })}
            >
              <MessageCircle aria-hidden="true" />
              {t("cta.whatsapp")}
            </HapticLink>
          </Button>
        </div>
        <Button asChild variant="outline" size="pill" className="w-full">
          <a
            href={property.contact.phoneHref}
            aria-label={t("cta.callAria", { title: property.title })}
          >
            <Phone aria-hidden="true" />
            {t("cta.call")}
            <span dir="ltr" className="font-semibold">
              {property.contact.phone}
            </span>
          </a>
        </Button>
        <Button asChild variant="ghost" size="pill" className="w-full">
          <HapticLink href={ROUTES.contact} haptics={false}>
            {t("cta.form")}
          </HapticLink>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-ink-muted">
        {property.code ? <span>{t("code", { code: property.code })}</span> : <span />}
        <ShareButton title={property.title} />
      </div>
    </div>
  );
}

/** Price block reused by the sidebar card and the mobile header. */
export function PropertyPrice({
  property,
  purposeLabel,
  perMeter,
  t,
  className,
}: {
  property: Property;
  purposeLabel: string;
  perMeter: number | null;
  t: DetailT;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm font-semibold text-primary">{purposeLabel}</p>
      <p className="text-3xl font-bold text-ink">
        {property.price != null
          ? t("price.value", { price: formatNumber(property.price) })
          : t("price.onRequest")}
      </p>
      {perMeter ? (
        <p className="text-sm text-ink-muted">
          {t("price.perMeter", { price: formatNumber(perMeter) })}
        </p>
      ) : null}
    </div>
  );
}

/** Native share sheet when available, otherwise copies the page link. */
function ShareButton({ title }: { title: string }) {
  const t = useTranslations("PropertyDetail");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* dismissed share sheet or blocked clipboard */
    }
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={share} aria-live="polite">
      {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
      {copied ? t("cta.copied") : t("cta.share")}
    </Button>
  );
}

/**
 * Up to three other listings in the same governorate (or of the same type).
 */
export function SimilarProperties({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  const query = useProperties(
    property.governorate
      ? { governorate: property.governorate, limit: 4 }
      : { kind: property.kind, limit: 4 },
  );
  const items = (query.data ?? [])
    .filter((item) => item.id !== property.id)
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="similar-properties-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="similar-properties-title" className="text-2xl font-bold text-ink md:text-3xl">
          {t("similar.title")}
        </h2>
        <HapticLink
          href="/properties"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {t("similar.viewAll")}
          <ChevronRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </HapticLink>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </section>
  );
}
