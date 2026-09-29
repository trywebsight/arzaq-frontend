import {
  FILTER_ALL,
  GOVERNORATES,
  PRICE_RANGES,
  PROPERTIES_PAGE_SIZE,
  type PriceRangeId,
} from "@/features/properties/constants";
import type {
  GovernorateId,
  PropertyFilters,
  PropertyKind,
  PropertyPurpose,
} from "@/features/properties/types";

const PURPOSES = new Set<PropertyPurpose>(["sale", "rent", "exchange"]);
/** Type ids are dashboard ids (live) or readable keys (fixtures). */
const KIND_PATTERN = /^[a-z0-9-]{1,40}$/i;
const GOVERNORATE_SET = new Set<string>(GOVERNORATES);
/** Matches the backend's `search` validation limit. */
const MAX_SEARCH_LENGTH = 120;
const PRICE_IDS = new Set(PRICE_RANGES.map((range) => range.id));

export type ListingParams = {
  purpose?: PropertyPurpose;
  kind?: PropertyKind;
  /** Governorate id stored in the `city` search param for shareable URLs. */
  city?: GovernorateId;
  price?: PriceRangeId;
  /** Free-text search (`?q=`): area, type, description or property number. */
  search?: string;
  page: number;
  /** Preserved across filter navigation so `?mockState=` keeps working. */
  mockState?: string;
};

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/**
 * Parse listing URL search params into a typed filter bag.
 * Unknown values are dropped so bad links still render the full list.
 */
export function parseListingParams(
  searchParams?: Record<string, string | string[] | undefined>,
): ListingParams {
  const purposeRaw = first(searchParams?.purpose);
  const kindRaw = first(searchParams?.kind);
  const cityRaw = first(searchParams?.city);
  const priceRaw = first(searchParams?.price);
  const pageRaw = first(searchParams?.page);
  const searchRaw = first(searchParams?.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  const mockStateRaw = first(searchParams?.mockState);

  return {
    purpose:
      purposeRaw && PURPOSES.has(purposeRaw as PropertyPurpose)
        ? (purposeRaw as PropertyPurpose)
        : undefined,
    kind:
      kindRaw && KIND_PATTERN.test(kindRaw)
        ? kindRaw
        : undefined,
    city:
      cityRaw && GOVERNORATE_SET.has(cityRaw)
        ? (cityRaw as GovernorateId)
        : undefined,
    price:
      priceRaw && PRICE_IDS.has(priceRaw as PriceRangeId)
        ? (priceRaw as PriceRangeId)
        : undefined,
    search: searchRaw || undefined,
    page: parsePage(pageRaw),
    mockState: mockStateRaw,
  };
}

/** Map listing URL params onto the shared `PropertyFilters` query shape. */
export function listingToPropertyFilters(
  params: ListingParams,
): PropertyFilters {
  const range = params.price
    ? PRICE_RANGES.find((item) => item.id === params.price)
    : undefined;

  return {
    purpose: params.purpose,
    kind: params.kind,
    governorate: params.city,
    minPrice: range?.min,
    maxPrice: range?.max ?? undefined,
    search: params.search,
  };
}

export type ListingParamPatch = Partial<{
  purpose: PropertyPurpose | typeof FILTER_ALL;
  kind: PropertyKind | typeof FILTER_ALL;
  city: GovernorateId | typeof FILTER_ALL;
  price: PriceRangeId | typeof FILTER_ALL;
  search: string | typeof FILTER_ALL;
  page: number;
}>;

/**
 * Build a `/properties?...` href from the current params plus a patch.
 * Filter changes always reset `page` to 1 unless `page` is in the patch.
 */
export function buildListingHref(
  current: ListingParams,
  patch: ListingParamPatch = {},
): string {
  const next: ListingParams = {
    purpose:
      patch.purpose === FILTER_ALL
        ? undefined
        : patch.purpose !== undefined
          ? patch.purpose
          : current.purpose,
    kind:
      patch.kind === FILTER_ALL
        ? undefined
        : patch.kind !== undefined
          ? patch.kind
          : current.kind,
    city:
      patch.city === FILTER_ALL
        ? undefined
        : patch.city !== undefined
          ? patch.city
          : current.city,
    price:
      patch.price === FILTER_ALL
        ? undefined
        : patch.price !== undefined
          ? patch.price
          : current.price,
    search:
      patch.search === FILTER_ALL
        ? undefined
        : patch.search !== undefined
          ? patch.search.trim().slice(0, MAX_SEARCH_LENGTH) || undefined
          : current.search,
    page:
      patch.page !== undefined
        ? Math.max(1, patch.page)
        : "purpose" in patch ||
            "kind" in patch ||
            "city" in patch ||
            "price" in patch ||
            "search" in patch
          ? 1
          : current.page,
  };

  const qs = new URLSearchParams();
  if (next.purpose) qs.set("purpose", next.purpose);
  if (next.kind) qs.set("kind", next.kind);
  if (next.city) qs.set("city", next.city);
  if (next.price) qs.set("price", next.price);
  if (next.search) qs.set("q", next.search);
  if (next.page > 1) qs.set("page", String(next.page));
  if (current.mockState) qs.set("mockState", current.mockState);

  const search = qs.toString();
  return search ? `/properties?${search}` : "/properties";
}

export { PROPERTIES_PAGE_SIZE };
