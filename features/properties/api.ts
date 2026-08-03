import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Property, PropertyFilters } from "@/features/properties/types";

/** GET /properties */
export function fetchProperties(
  filters: PropertyFilters = {},
  signal?: AbortSignal,
): Promise<Property[]> {
  return apiFetch<Property[]>(endpoints.properties, {
    signal,
    searchParams: {
      purpose: filters.purpose,
      kind: filters.kind,
      city: filters.city,
      governorate: filters.governorate,
      featured: filters.featured,
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      limit: filters.limit,
    },
  });
}

/** GET /properties/:idOrSlug — resolves to `null` when not found. */
export function fetchProperty(
  idOrSlug: string,
  signal?: AbortSignal,
): Promise<Property | null> {
  return apiFetch<Property | null>(endpoints.property(idOrSlug), {
    signal,
    nullOn404: true,
  });
}
