"use client";

import { useQuery } from "@tanstack/react-query";

import { serviceQuery, servicesQuery } from "@/features/services/queries";
import type { ServiceFilters } from "@/features/services/types";

export function useServices(filters: ServiceFilters = {}) {
  return useQuery(servicesQuery(filters));
}

export function useService(slug: string) {
  return useQuery(serviceQuery(slug));
}
