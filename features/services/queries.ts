import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { fetchService, fetchServices } from "@/features/services/api";
import type { ServiceFilters } from "@/features/services/types";

export const servicesQuery = (filters: ServiceFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.services.list(filters),
    queryFn: ({ signal }) => fetchServices(filters, signal),
  });

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.services.detail(slug),
    queryFn: ({ signal }) => fetchService(slug, signal),
  });
