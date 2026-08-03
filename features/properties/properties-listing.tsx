"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ListFilter, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FILTER_ALL,
  GOVERNORATES,
  PRICE_RANGES,
  PROPERTY_KINDS,
  PROPERTY_PURPOSES,
  type PriceRangeId,
} from "@/features/properties/constants";
import {
  buildListingHref,
  listingToPropertyFilters,
  PROPERTIES_PAGE_SIZE,
  type ListingParamPatch,
  type ListingParams,
} from "@/features/properties/listing-params";
import { useProperties } from "@/features/properties/hooks";
import { PropertyCard } from "@/features/properties/property-card";
import { PropertiesListingGridSkeleton } from "@/features/properties/skeletons";
import type {
  GovernorateId,
  PropertyKind,
  PropertyPurpose,
} from "@/features/properties/types";
import {
  BoneSkeleton,
  QueryState,
  Section,
  SectionHeader,
} from "@/components/common";
import { Reveal, StaggerGroup } from "@/components/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type PropertiesListingProps = {
  /** Parsed URL filters + page. Drives query and UI controls. */
  params: ListingParams;
};

function formatLatn(value: number): string {
  return new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
  }).format(value);
}

const SELECT_TRIGGER_CLASS =
  "h-11 w-full min-w-0 rounded-full border-transparent bg-secondary px-4 text-sm font-medium text-ink shadow-none hover:bg-secondary/80";

function countActiveFilters(params: ListingParams): number {
  return [params.purpose, params.kind, params.city, params.price].filter(
    Boolean,
  ).length;
}

function preserveSelectOutside(event: {
  target: EventTarget | null;
  preventDefault: () => void;
}) {
  const target = event.target as Element | null;
  if (target?.closest('[role="listbox"]')) {
    event.preventDefault();
  }
}

/**
 * Properties listing — filters, governorate pills, fixed 2-col grid and
 * URL-driven pagination.
 *
 * @param params - Parsed `?purpose=&kind=&city=&price=&page=` values.
 * @example
 * <PropertiesListing params={parseListingParams(searchParams)} />
 */
export function PropertiesListing({ params }: PropertiesListingProps) {
  const t = useTranslations("PropertiesPage");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const filters = listingToPropertyFilters(params);
  const query = useProperties(filters);
  const titleId = "properties-listing-title";
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navigate = (patch: ListingParamPatch) => {
    router.push(buildListingHref(params, patch), { scroll: false });
  };

  const activeFilterCount = countActiveFilters(params);
  const hasActiveFilters = activeFilterCount > 0 || params.page > 1;

  const clearFilters = () => {
    router.push(
      buildListingHref(params, {
        purpose: FILTER_ALL,
        kind: FILTER_ALL,
        city: FILTER_ALL,
        price: FILTER_ALL,
        page: 1,
      }),
      { scroll: false },
    );
  };

  const filterControls = (
    <PropertyFilterControls
      params={params}
      onNavigate={navigate}
      hasActiveFilters={hasActiveFilters}
      onClear={clearFilters}
      showClearInline
    />
  );

  return (
    <Section aria-labelledby={titleId} spacing="default">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        titleAs="h1"
        titleId={titleId}
        layout="stacked"
      />

      {/* Mobile: trigger + bottom sheet */}
      <Reveal
        as="div"
        from="bottom"
        distance={16}
        delay={0.08}
        className="mt-8 md:hidden"
      >
        <div className="flex items-center gap-2">
          {/*
            `modal={false}` so BeUI Select listboxes (portaled to body) stay
            clickable; overlay + Escape still dismiss via Sheet handlers.
          */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen} modal={false}>
            <Button
              type="button"
              size="pill"
              variant="secondary"
              className="bg-secondary text-ink hover:bg-secondary/80"
              aria-label={t("filters.openAria")}
              aria-expanded={filtersOpen}
              aria-haspopup="dialog"
              onClick={() => setFiltersOpen(true)}
            >
              <ListFilter aria-hidden="true" data-icon="inline-start" />
              {t("filters.open")}
              {activeFilterCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                  {formatLatn(activeFilterCount)}
                </span>
              ) : null}
            </Button>

            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="max-h-[85dvh] gap-0 overflow-hidden rounded-t-2xl p-0"
              // BeUI Select portals its listbox to `document.body`; keep the
              // sheet open and interactive when that listbox is used.
              onPointerDownOutside={preserveSelectOutside}
              onFocusOutside={preserveSelectOutside}
              onInteractOutside={preserveSelectOutside}
            >
              <SheetHeader className="relative border-b border-border px-4 pb-3 pt-4 pe-14">
                <SheetTitle>{t("filters.drawerTitle")}</SheetTitle>
                <SheetDescription>
                  {t("filters.drawerDescription")}
                </SheetDescription>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 inset-e-3"
                    aria-label={tCommon("close")}
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className="overflow-y-auto px-4 py-4">
                <PropertyFilterControls
                  params={params}
                  onNavigate={navigate}
                  hasActiveFilters={hasActiveFilters}
                  onClear={clearFilters}
                  showClearInline={false}
                  stacked
                />
              </div>

              <SheetFooter className="border-t border-border">
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    size="pill"
                    variant="outline"
                    className="w-full"
                    aria-label={t("filters.clearAria")}
                    onClick={clearFilters}
                  >
                    {t("filters.clear")}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="pill"
                  variant="primary"
                  className="w-full"
                  aria-label={t("filters.applyAria")}
                  onClick={() => setFiltersOpen(false)}
                >
                  {t("filters.apply")}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {hasActiveFilters ? (
            <Button
              type="button"
              size="pill-sm"
              variant="outline"
              className="ms-auto"
              aria-label={t("filters.clearAria")}
              onClick={clearFilters}
            >
              {t("filters.clear")}
            </Button>
          ) : null}
        </div>
      </Reveal>

      {/* Desktop: inline selects + governorate chips */}
      <div className="hidden md:block">
        <Reveal
          as="div"
          from="bottom"
          distance={16}
          delay={0.08}
          className="mt-8 md:mt-10"
        >
          {filterControls}
        </Reveal>
      </div>

      <div className="mt-10 md:mt-12">
        <QueryState
          query={query}
          emptyTitle={t("empty.title")}
          emptyDescription={t("empty.description")}
          skeleton={
            <BoneSkeleton
              name="properties-listing-grid"
              loading
              fallback={<PropertiesListingGridSkeleton />}
            >
              <PropertiesListingGridSkeleton />
            </BoneSkeleton>
          }
        >
          {(properties) => {
            const totalPages = Math.max(
              1,
              Math.ceil(properties.length / PROPERTIES_PAGE_SIZE),
            );
            const page = Math.min(params.page, totalPages);
            const start = (page - 1) * PROPERTIES_PAGE_SIZE;
            const pageItems = properties.slice(
              start,
              start + PROPERTIES_PAGE_SIZE,
            );

            return (
              <div className="flex flex-col gap-10">
                <p className="text-sm text-ink-muted">
                  {t("results.count", {
                    count: formatLatn(properties.length),
                  })}
                </p>

                <StaggerGroup
                  className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"
                  stagger={0.08}
                >
                  {pageItems.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      className="h-full"
                    />
                  ))}
                </StaggerGroup>

                {totalPages > 1 ? (
                  <ListingPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => navigate({ page: nextPage })}
                  />
                ) : null}
              </div>
            );
          }}
        </QueryState>
      </div>
    </Section>
  );
}

function PropertyFilterControls({
  params,
  onNavigate,
  hasActiveFilters,
  onClear,
  showClearInline,
  stacked = false,
}: {
  params: ListingParams;
  onNavigate: (patch: ListingParamPatch) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
  showClearInline: boolean;
  stacked?: boolean;
}) {
  const t = useTranslations("PropertiesPage");

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "grid gap-3",
          stacked ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        <FilterSelect
          label={t("filters.purpose.label")}
          value={params.purpose ?? FILTER_ALL}
          triggerClassName={SELECT_TRIGGER_CLASS}
          onChange={(value) =>
            onNavigate({
              purpose: value as PropertyPurpose | typeof FILTER_ALL,
            })
          }
        >
          <SelectItem value={FILTER_ALL}>{t("filters.purpose.all")}</SelectItem>
          {PROPERTY_PURPOSES.map((purpose) => (
            <SelectItem key={purpose} value={purpose}>
              {t(`filters.purpose.${purpose}`)}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          label={t("filters.kind.label")}
          value={params.kind ?? FILTER_ALL}
          triggerClassName={SELECT_TRIGGER_CLASS}
          onChange={(value) =>
            onNavigate({ kind: value as PropertyKind | typeof FILTER_ALL })
          }
        >
          <SelectItem value={FILTER_ALL}>{t("filters.kind.all")}</SelectItem>
          {PROPERTY_KINDS.map((kind) => (
            <SelectItem key={kind} value={kind}>
              {t(`filters.kind.${kind}`)}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          label={t("filters.city.label")}
          value={params.city ?? FILTER_ALL}
          triggerClassName={SELECT_TRIGGER_CLASS}
          onChange={(value) =>
            onNavigate({ city: value as GovernorateId | typeof FILTER_ALL })
          }
        >
          <SelectItem value={FILTER_ALL}>{t("filters.city.all")}</SelectItem>
          {GOVERNORATES.map((id) => (
            <SelectItem key={id} value={id}>
              {t(`filters.governorates.${id}`)}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          label={t("filters.price.label")}
          value={params.price ?? FILTER_ALL}
          triggerClassName={SELECT_TRIGGER_CLASS}
          onChange={(value) =>
            onNavigate({ price: value as PriceRangeId | typeof FILTER_ALL })
          }
        >
          <SelectItem value={FILTER_ALL}>{t("filters.price.all")}</SelectItem>
          {PRICE_RANGES.map((range) => (
            <SelectItem key={range.id} value={range.id}>
              {t(`filters.price.${range.id}`)}
            </SelectItem>
          ))}
        </FilterSelect>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label={t("filters.governorates.label")}
          className="flex flex-wrap gap-2"
        >
          <Button
            type="button"
            size="pill-sm"
            variant={!params.city ? "primary" : "secondary"}
            aria-pressed={!params.city}
            className={cn(
              params.city && "bg-secondary text-ink hover:bg-secondary/80",
            )}
            onClick={() => onNavigate({ city: FILTER_ALL })}
          >
            {t("filters.governorates.all")}
          </Button>
          {GOVERNORATES.map((id) => {
            const active = params.city === id;
            return (
              <Button
                key={id}
                type="button"
                size="pill-sm"
                variant={active ? "primary" : "secondary"}
                aria-pressed={active}
                className={cn(
                  !active && "bg-secondary text-ink hover:bg-secondary/80",
                )}
                onClick={() => onNavigate({ city: id })}
              >
                {t(`filters.governorates.${id}`)}
              </Button>
            );
          })}
        </div>

        {showClearInline && hasActiveFilters ? (
          <Button
            type="button"
            size="pill-sm"
            variant="outline"
            className="ms-auto"
            aria-label={t("filters.clearAria")}
            onClick={onClear}
          >
            {t("filters.clear")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  triggerClassName,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="sr-only">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className={triggerClassName}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-y-auto">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

function ListingPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("PropertiesPage");
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label={t("pagination.label")}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <Button
        type="button"
        variant="outline"
        size="pill-sm"
        disabled={page <= 1}
        aria-label={t("pagination.previous")}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft
          aria-hidden="true"
          data-icon="inline-start"
          className="rtl:-scale-x-100"
        />
        {t("pagination.previous")}
      </Button>

      {pages.map((n) => (
        <Button
          key={n}
          type="button"
          variant={n === page ? "primary" : "outline"}
          size="icon-pill-sm"
          aria-label={t("pagination.page", { page: formatLatn(n) })}
          aria-current={n === page ? "page" : undefined}
          onClick={() => onPageChange(n)}
        >
          {formatLatn(n)}
        </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        size="pill-sm"
        disabled={page >= totalPages}
        aria-label={t("pagination.next")}
        onClick={() => onPageChange(page + 1)}
      >
        {t("pagination.next")}
        <ChevronRight
          aria-hidden="true"
          data-icon="inline-end"
          className="rtl:-scale-x-100"
        />
      </Button>
    </nav>
  );
}
