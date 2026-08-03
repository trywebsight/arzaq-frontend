import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Service, ServiceFilters } from "@/features/services/types";

/** GET /services */
export function fetchServices(
  filters: ServiceFilters = {},
  signal?: AbortSignal,
): Promise<Service[]> {
  return apiFetch<Service[]>(endpoints.services, {
    signal,
    searchParams: { limit: filters.limit },
  });
}

/** GET /services/:slug — resolves to `null` when not found. */
export function fetchService(
  slug: string,
  signal?: AbortSignal,
): Promise<Service | null> {
  return apiFetch<Service | null>(endpoints.service(slug), {
    signal,
    nullOn404: true,
  });
}
