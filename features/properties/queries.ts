import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchProperties,
  fetchProperty,
  fetchPropertyTypes,
} from "@/features/properties/api";
import type { PropertyFilters } from "@/features/properties/types";

/**
 * Shared by the server prefetch and the client hook, guaranteeing key parity.
 *
 * @example
 * // server
 * await getQueryClient().prefetchQuery(propertiesQuery({ featured: true }));
 * // client
 * const { data } = useQuery(propertiesQuery({ featured: true }));
 */
export const propertiesQuery = (filters: PropertyFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.properties.list(filters),
    queryFn: ({ signal }) => fetchProperties(filters, signal),
  });

/**
 * The home page rail: featured listings, or the latest ones while none are
 * marked featured, so the section is never empty when listings exist.
 */
export const featuredPropertiesQuery = (limit = 3) =>
  queryOptions({
    queryKey: queryKeys.properties.list({ featured: true, limit }),
    queryFn: async ({ signal }) => {
      const featured = await fetchProperties({ featured: true, limit }, signal);
      return featured.length > 0 ? featured : fetchProperties({ limit }, signal);
    },
  });

export const propertyQuery = (idOrSlug: string) =>
  queryOptions({
    queryKey: queryKeys.properties.detail(idOrSlug),
    queryFn: ({ signal }) => fetchProperty(idOrSlug, signal),
  });

/** Options for the type filter. Rarely changes, so it stays fresh for 5 minutes. */
export const propertyTypesQuery = () =>
  queryOptions({
    queryKey: queryKeys.properties.types(),
    queryFn: ({ signal }) => fetchPropertyTypes(signal),
    staleTime: 5 * 60 * 1000,
  });
