"use client";

import { useQuery } from "@tanstack/react-query";

import {
  featuredPropertiesQuery,
  propertiesQuery,
  propertyQuery,
} from "@/features/properties/queries";
import type { PropertyFilters } from "@/features/properties/types";

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery(propertiesQuery(filters));
}

export function useFeaturedProperties(limit = 3) {
  return useQuery(featuredPropertiesQuery(limit));
}

export function useProperty(idOrSlug: string) {
  return useQuery(propertyQuery(idOrSlug));
}
