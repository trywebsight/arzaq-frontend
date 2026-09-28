"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, Hash, MapPin } from "lucide-react";

import type { ImageAsset } from "@/lib/assets";
import type { Property, PropertyPurpose } from "@/features/properties/types";
import { useProperty } from "@/features/properties/hooks";
import { MobileContactBar } from "@/features/properties/mobile-contact-bar";
import { PropertyDescription } from "@/features/properties/property-description";
import { PropertyGallery } from "@/features/properties/property-gallery";
import {
  PropertyContactCard,
  PropertyDetailsList,
  PropertyFacts,
  PropertyHeroMedia,
  PropertyInvestment,
  PropertyLocationMap,
  PropertyPrice,
  PropertyVideoTour,
  SimilarProperties,
  formatDate,
  pricePerMeter,
} from "@/features/properties/property-detail-sections";
import { PropertyDetailSkeleton } from "@/features/properties/skeletons";
import {
  BoneSkeleton,
  Eyebrow,
  HapticLink,
  ImageLightbox,
  QueryState,
  Section,
} from "@/components/common";
import { Reveal } from "@/components/motion";
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

function locationLine(property: Property): string {
  const parts = [property.district, property.city, property.governorateLabel];
  const line = parts.filter(Boolean).join("، ");
  return line || property.address || "";
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
  const gallery = galleryFor(property);
  const location = locationLine(property);
  const published = formatDate(property.publishedAt);
  const description = property.description || property.excerpt;
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const contactTriggerRef = React.useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div className="space-y-14 pb-24 md:space-y-20 md:pb-0">
      <header className="space-y-6 md:space-y-8">
        <Reveal as="div" from="bottom" distance={12} trigger="mount">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow>
              {purposeLabel} · {property.kindLabel}
            </Eyebrow>
            <PropertyBackLink />
          </div>
        </Reveal>

        <Reveal as="div" from="bottom" distance={18} delay={0.06} trigger="mount">
          <div className="space-y-4">
            <h1
              id="property-detail-heading"
              className="max-w-4xl text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl"
            >
              {property.title}
            </h1>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted md:text-base">
              {location ? (
                <li className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-4 shrink-0" />
                  {location}
                </li>
              ) : null}
              {property.code ? (
                <li className="inline-flex items-center gap-1.5">
                  <Hash aria-hidden="true" className="size-4 shrink-0" />
                  {t("code", { code: property.code })}
                </li>
              ) : null}
              {published ? (
                <li className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                  {t("publishedOn", { date: published })}
                </li>
              ) : null}
            </ul>
          </div>
        </Reveal>

        <Reveal as="div" from="bottom" distance={22} delay={0.12} trigger="mount">
          <PropertyHeroMedia
            images={gallery}
            title={property.title}
            onOpen={openLightbox}
          />
        </Reveal>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:gap-14">
        <div className="min-w-0 space-y-12">
          <PropertyPrice
            property={property}
            purposeLabel={purposeLabel}
            perMeter={pricePerMeter(property)}
            t={t}
            className="lg:hidden"
          />

          <Reveal as="div" from="bottom" distance={16}>
            <PropertyFacts property={property} />
          </Reveal>

          {description ? (
            <Reveal as="section" from="bottom" distance={16} aria-labelledby="property-about-title">
              <h2
                id="property-about-title"
                className="text-xl font-bold text-balance text-ink md:text-2xl"
              >
                {t("descriptionTitle")}
              </h2>
              <PropertyDescription
                key={property.id}
                className="mt-3"
                text={description}
              />
            </Reveal>
          ) : null}

          <Reveal as="div" from="bottom" distance={16}>
            <PropertyDetailsList property={property} purposeLabel={purposeLabel} />
          </Reveal>

          <PropertyInvestment property={property} />
          <PropertyVideoTour property={property} />
          <PropertyLocationMap property={property} />

          {gallery.length > 3 ? (
            <section aria-label={t("gallery.label")}>
              <PropertyGallery
                images={gallery}
                altFallback={property.title}
                label={t("gallery.label")}
                onOpen={openLightbox}
              />
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28">
          <PropertyContactCard
            property={property}
            purposeLabel={purposeLabel}
            triggerRef={contactTriggerRef}
          />
        </aside>
      </div>

      <SimilarProperties property={property} />

      <ImageLightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        altFallback={property.title}
      />

      <MobileContactBar
        href={property.contact.whatsappHref}
        external
        label={t("cta.whatsapp")}
        ariaLabel={t("cta.whatsappAria", { title: property.title })}
        triggerRef={contactTriggerRef}
        suppressed={lightboxIndex != null}
      />
    </div>
  );
}
