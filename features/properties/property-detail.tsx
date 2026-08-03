"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

import type { ImageAsset } from "@/lib/assets";
import type { Property, PropertyPurpose } from "@/features/properties/types";
import { useProperty } from "@/features/properties/hooks";
import { MobileContactBar } from "@/features/properties/mobile-contact-bar";
import { PropertyDescription } from "@/features/properties/property-description";
import { PropertyGallery } from "@/features/properties/property-gallery";
import { PropertyDetailSkeleton } from "@/features/properties/skeletons";
import {
  BoneSkeleton,
  Eyebrow,
  HapticLink,
  ImageLightbox,
  QueryState,
  Section,
  SmartImage,
} from "@/components/common";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Lens } from "@/components/ui/lens";
import { haptic } from "@/lib/haptic";
import { hasImageSrc } from "@/lib/api/media";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

type BackKind = "home" | "properties";

type BackTarget = {
  href: string;
  kind: BackKind;
  useHistory: boolean;
};

const DEFAULT_BACK: BackTarget = {
  href: "/properties",
  kind: "properties",
  useHistory: false,
};

let cachedBack: BackTarget = DEFAULT_BACK;

const subscribeNoop = () => () => {};
const getServerBack = () => DEFAULT_BACK;

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function sameBackTarget(a: BackTarget, b: BackTarget): boolean {
  return (
    a.href === b.href && a.kind === b.kind && a.useHistory === b.useHistory
  );
}

/** Prefer same-origin referrer for label + href; use history when safe. */
function resolveBackTarget(): BackTarget {
  let next: BackTarget = DEFAULT_BACK;

  if (typeof window !== "undefined") {
    const referrer = document.referrer;
    if (referrer) {
      try {
        const refUrl = new URL(referrer);
        if (refUrl.origin === window.location.origin) {
          const path = normalizePath(refUrl.pathname);
          const useHistory = window.history.length > 1;

          if (path === "/") {
            next = { href: "/", kind: "home", useHistory };
          } else if (path === "/properties") {
            next = { href: "/properties", kind: "properties", useHistory };
          } else {
            next = useHistory ? { ...DEFAULT_BACK, useHistory } : DEFAULT_BACK;
          }
        }
      } catch {
        next = DEFAULT_BACK;
      }
    }
  }

  if (sameBackTarget(next, cachedBack)) return cachedBack;
  cachedBack = next;
  return cachedBack;
}

function PropertyBackLink() {
  const t = useTranslations("PropertyDetail");
  const router = useRouter();
  const target = React.useSyncExternalStore(
    subscribeNoop,
    resolveBackTarget,
    getServerBack,
  );

  const label = target.kind === "home" ? t("backHome") : t("back");
  const ariaLabel = target.kind === "home" ? t("backHomeAria") : t("backAria");

  return (
    <HapticLink
      href={target.href}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-primary"
      onClick={(event) => {
        if (!target.useHistory) return;
        event.preventDefault();
        router.back();
      }}
    >
      <ChevronLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
      {label}
    </HapticLink>
  );
}

export type PropertyDetailProps = {
  /** Slug or id matching `propertyQuery`. */
  slug: string;
  className?: string;
};

function formatLatn(value: number, pad = false): string {
  return new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    ...(pad ? { minimumIntegerDigits: 2 } : null),
  }).format(value);
}

type SpecRow = {
  key: string;
  label: string;
  value: string;
};

function buildSpecs(
  property: Property,
  t: ReturnType<typeof useTranslations<"PropertyDetail">>,
): SpecRow[] {
  const rows: SpecRow[] = [
    {
      key: "area",
      label: t("about.specs.area"),
      value: t("about.areaValue", { area: formatLatn(property.area) }),
    },
  ];

  if (property.floors != null) {
    rows.push({
      key: "floors",
      label: t("about.specs.floors"),
      value: formatLatn(property.floors, true),
    });
  }
  if (property.bedrooms != null) {
    rows.push({
      key: "bedrooms",
      label: t("about.specs.bedrooms"),
      value: formatLatn(property.bedrooms, true),
    });
  }
  if (property.bathrooms != null) {
    rows.push({
      key: "bathrooms",
      label: t("about.specs.bathrooms"),
      value: formatLatn(property.bathrooms, true),
    });
  }
  if (property.garage != null) {
    rows.push({
      key: "garage",
      label: t("about.specs.garage"),
      value: formatLatn(property.garage, true),
    });
  }

  return rows;
}

function galleryFor(property: Property): ImageAsset[] {
  const seen = new Set<string>();
  const images: ImageAsset[] = [];

  const push = (asset: ImageAsset | null | undefined) => {
    if (!asset?.src) return;
    if (seen.has(asset.src)) return;
    seen.add(asset.src);
    images.push(asset);
  };

  push(property.image);
  for (const asset of property.gallery ?? []) {
    push(asset);
  }

  return images;
}

function addressLine(property: Property): string {
  if (property.address) return property.address;
  return [property.district, property.city].filter(Boolean).join("، ");
}

/**
 * Property detail body — hero, accommodation card, gallery — driven by
 * `useProperty` + `QueryState`.
 *
 * @param slug - Route slug matching the listing card href.
 * @example
 * <PropertyDetail slug="villa-bayan" />
 */
export function PropertyDetail({ slug, className }: PropertyDetailProps) {
  const t = useTranslations("PropertyDetail");
  const query = useProperty(slug);

  return (
    <main
      id="main"
      tabIndex={-1}
      className={cn("flex-1", className)}
      aria-labelledby="property-detail-heading"
    >
      <Section spacing="compact" containerClassName="pt-4 md:pt-6">
        <QueryState
          query={query}
          isEmpty={(data) => data == null}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          skeleton={
            <BoneSkeleton
              name="property-detail"
              loading
              fallback={<PropertyDetailSkeleton />}
            >
              <PropertyDetailSkeleton />
            </BoneSkeleton>
          }
        >
          {(property) =>
            property ? <PropertyDetailContent property={property} /> : null
          }
        </QueryState>
      </Section>
    </main>
  );
}

function PropertyDetailContent({ property }: { property: Property }) {
  const t = useTranslations("PropertyDetail");
  const purpose = property.purpose as PropertyPurpose;
  const purposeLabel = t(`purpose.${purpose}`);
  const specs = buildSpecs(property, t);
  const gallery = galleryFor(property);
  const location = addressLine(property);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const contactTriggerRef = React.useRef<HTMLSpanElement>(null);

  const openLightbox = (index: number) => {
    haptic();
    setLightboxIndex(index);
  };
  return (
    <div className="space-y-14 pb-24 md:space-y-20 md:pb-0">
      <header className="space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal as="div" from="bottom" distance={12} trigger="mount">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal
            as="div"
            from="bottom"
            distance={12}
            delay={0.05}
            trigger="mount"
          >
            <PropertyBackLink />
          </Reveal>
        </div>

        <Reveal
          as="div"
          from="bottom"
          distance={18}
          delay={0.06}
          trigger="mount"
        >
          <h1
            id="property-detail-heading"
            className="max-w-3xl text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl "
          >
            {t("headline")}
          </h1>
        </Reveal>

        <Reveal
          as="div"
          from="bottom"
          distance={22}
          delay={0.12}
          trigger="mount"
        >
          <div className="relative isolate overflow-hidden rounded-media bg-muted">
            {hasImageSrc(property.image) ? (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                aria-label={t("gallery.openHero")}
                className="relative block aspect-4/3 min-h-80 w-full cursor-zoom-in md:aspect-16/10 md:min-h-112 xl:min-h-128 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Lens className="absolute inset-0 size-full">
                  <SmartImage
                    src={property.image.src}
                    alt={property.image.alt || property.title}
                    priority
                    fill
                    blurDataURL={property.image.blurDataURL}
                    quality={70}
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
                  />
                </Lens>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-black/65 via-black/20 to-transparent"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 text-start md:p-8 xl:p-10">
                  <div className="max-w-2xl text-white">
                    <p className="mb-2 inline-flex items-center text-sm font-semibold tracking-wide">
                      <span
                        aria-hidden="true"
                        className="me-2 inline-block size-1.5 rounded-full bg-white"
                      />
                      {purposeLabel}
                    </p>
                    <h2 className="text-2xl/[1.35] font-bold text-balance md:text-3xl xl:text-4xl">
                      {property.title}
                    </h2>
                    <p className="mt-2 text-sm text-pretty text-white/80 md:text-base">
                      {location}
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="relative flex aspect-4/3 min-h-80 w-full items-end md:aspect-16/10 md:min-h-112 xl:min-h-128">
                <div className="relative z-20 w-full bg-linear-to-t from-black/65 via-black/20 to-transparent p-5 text-start md:p-8 xl:p-10">
                  <div className="max-w-2xl text-white">
                    <p className="mb-2 inline-flex items-center text-sm font-semibold tracking-wide">
                      <span
                        aria-hidden="true"
                        className="me-2 inline-block size-1.5 rounded-full bg-white"
                      />
                      {purposeLabel}
                    </p>
                    <h2 className="text-2xl/[1.35] font-bold text-balance md:text-3xl xl:text-4xl">
                      {property.title}
                    </h2>
                    <p className="mt-2 text-sm text-pretty text-white/80 md:text-base">
                      {location}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </header>

      <section
        aria-labelledby="property-about-title"
        className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16"
      >
        <Reveal
          as="aside"
          from="bottom"
          distance={16}
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start lg:justify-start"
        >
          <Eyebrow className="shrink-0">{t("about.eyebrow")}</Eyebrow>
          <span ref={contactTriggerRef} className="inline-flex shrink-0">
            <Button asChild variant="primary" size="pill">
              <HapticLink
                href={ROUTES.contact}
                aria-label={t("about.contactAria", { title: property.title })}
                haptics={false}
              >
                {t("about.contact")}
              </HapticLink>
            </Button>
          </span>
        </Reveal>

        <Reveal
          as="div"
          from="bottom"
          distance={18}
          delay={0.08}
          className="min-w-0"
        >
          <article className="rounded-card border border-border bg-card p-6 shadow-xs md:p-8 xl:p-10">
            <h2
              id="property-about-title"
              className="text-xl font-bold text-balance text-ink md:text-2xl"
            >
              {t("about.title")}
            </h2>
            <PropertyDescription
              key={property.id}
              className="mt-3"
              text={property.excerpt}
            />

            <h3 className="mt-8 text-base font-bold text-ink md:text-lg">
              {t("about.propertyHeading")}
            </h3>
            <dl className="mt-4 divide-y divide-border">
              {specs.map((row) => (
                <div
                  key={row.key}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-ink-muted md:text-base">
                    {row.label}
                  </dt>
                  <dd className="text-sm font-bold text-ink md:text-base">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </Reveal>
      </section>

      <section aria-label={t("gallery.label")}>
        <Reveal as="div" from="bottom" distance={20}>
          <PropertyGallery
            images={gallery}
            altFallback={property.title}
            label={t("gallery.label")}
            onOpen={openLightbox}
          />
        </Reveal>
      </section>

      <ImageLightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        altFallback={property.title}
      />

      <MobileContactBar
        href={ROUTES.contact}
        label={t("about.contact")}
        ariaLabel={t("about.contactAria", { title: property.title })}
        triggerRef={contactTriggerRef}
        suppressed={lightboxIndex != null}
      />
    </div>
  );
}
