import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import {
  fetchProperties,
  fetchProperty,
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

/** The home page rail. Defaults to three featured listings. */
export const featuredPropertiesQuery = (limit = 3) =>
  propertiesQuery({ featured: true, limit });

export const propertyQuery = (idOrSlug: string) =>
  queryOptions({
    queryKey: queryKeys.properties.detail(idOrSlug),
    queryFn: ({ signal }) => fetchProperty(idOrSlug, signal),
  });
