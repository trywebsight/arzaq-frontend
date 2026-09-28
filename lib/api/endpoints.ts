/**
 * Every REST path the app knows about, in one place.
 *
 * Paths are relative to `API_URL` / `NEXT_PUBLIC_API_URL`. The mock resolver
 * in `mocks/registry.ts` matches on collection names for paths that have
 * fixtures today. Planned endpoints (settings, home, seo, faqs) are listed
 * here so go-live does not require scattering path strings. Legal
 * (`/legal/privacy`, `/legal/terms`) is wired end-to-end via mocks.
 *
 * Flip `MOCK_MODE=false` (or `NEXT_PUBLIC_MOCK_MODE=false`) to hit the real
 * API — no path rewriting in features.
 */
export const endpoints = {
  properties: "/properties",
  property: (idOrSlug: string) => `/properties/${encodeURIComponent(idOrSlug)}`,
  propertyTypes: "/property-types",
  team: "/team",
  teamMember: (idOrSlug: string) => `/team/${encodeURIComponent(idOrSlug)}`,
  posts: "/posts",
  post: (slug: string) => `/posts/${encodeURIComponent(slug)}`,
  services: "/services",
  service: (slug: string) => `/services/${encodeURIComponent(slug)}`,
  contact: "/contact",
  faqs: "/faqs",
  settings: "/settings",
  home: "/home",
  seo: (pageKey: string) => `/seo/${encodeURIComponent(pageKey)}`,
  /** CMS legal pages — `privacy` | `terms`. */
  legal: (slug: string) => `/legal/${encodeURIComponent(slug)}`,
} as const;
