import type { GovernorateId, PropertyPurpose } from "./types";

/** Fixed page size for the properties listing grid (2 × 3 on desktop). */
export const PROPERTIES_PAGE_SIZE = 6;

/** Ordered Kuwait governorates — pills and the city dropdown share this list. */
export const GOVERNORATES = [
  "asimah",
  "hawalli",
  "farwaniya",
  "mubarak",
  "ahmadi",
  "jahra",
] as const satisfies readonly GovernorateId[];

/** Purpose options for the listing filter. Labels: `PropertiesPage.filters.purpose.*`. */
export const PROPERTY_PURPOSES = [
  "sale",
  "rent",
  "exchange",
] as const satisfies readonly PropertyPurpose[];

export type PriceRangeId =
  | "0-1000"
  | "1000-200000"
  | "200000-500000"
  | "500000-800000"
  | "800000-";

export type PriceRange = {
  id: PriceRangeId;
  min: number;
  /** `null` means open-ended. */
  max: number | null;
};

/** Price buckets for the listing filter. Labels: `PropertiesPage.filters.price.*`. */
export const PRICE_RANGES: readonly PriceRange[] = [
  { id: "0-1000", min: 0, max: 1000 },
  { id: "1000-200000", min: 1000, max: 200000 },
  { id: "200000-500000", min: 200000, max: 500000 },
  { id: "500000-800000", min: 500000, max: 800000 },
  { id: "800000-", min: 800000, max: null },
] as const;

/** Sentinel Select value meaning “no filter”. */
export const FILTER_ALL = "all" as const;
