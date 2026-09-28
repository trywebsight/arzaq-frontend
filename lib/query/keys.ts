import type { PropertyFilters } from "@/features/properties/types";
import type { PostFilters } from "@/features/blog/types";
import type { ServiceFilters } from "@/features/services/types";
import type { TeamFilters } from "@/features/team/types";

/**
 * Domain-shaped query keys.
 *
 * Never inline a key array at a call site — the server prefetch and the client
 * hook must produce byte-identical keys or hydration silently refetches.
 * `queryOptions()` factories in `features/*\/queries.ts` already do this for
 * you; reach for these directly only when invalidating.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
 */
export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    lists: () => [...queryKeys.properties.all, "list"] as const,
    list: (filters: PropertyFilters = {}) =>
      [...queryKeys.properties.lists(), filters] as const,
    details: () => [...queryKeys.properties.all, "detail"] as const,
    detail: (idOrSlug: string) =>
      [...queryKeys.properties.details(), idOrSlug] as const,
    types: () => [...queryKeys.properties.all, "types"] as const,
  },

  team: {
    all: ["team"] as const,
    lists: () => [...queryKeys.team.all, "list"] as const,
    list: (filters: TeamFilters = {}) =>
      [...queryKeys.team.lists(), filters] as const,
    details: () => [...queryKeys.team.all, "detail"] as const,
    detail: (idOrSlug: string) =>
      [...queryKeys.team.details(), idOrSlug] as const,
  },

  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: PostFilters = {}) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.posts.details(), slug] as const,
  },

  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (filters: ServiceFilters = {}) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.services.details(), slug] as const,
  },

  settings: {
    all: ["settings"] as const,
    detail: () => [...queryKeys.settings.all, "detail"] as const,
  },

  home: {
    all: ["home"] as const,
    detail: () => [...queryKeys.home.all, "detail"] as const,
  },

  seo: {
    all: ["seo"] as const,
    detail: (pageKey: string) =>
      [...queryKeys.seo.all, "detail", pageKey] as const,
  },

  faqs: {
    all: ["faqs"] as const,
    list: () => [...queryKeys.faqs.all, "list"] as const,
  },

  legal: {
    all: ["legal"] as const,
    details: () => [...queryKeys.legal.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.legal.details(), slug] as const,
  },
} as const;
