import { posts } from "@/mocks/posts";
import { properties } from "@/mocks/properties";
import { services } from "@/mocks/services";
import { team } from "@/mocks/team";
import { privacyDocument, termsDocument } from "@/mocks/legal";
import { EMPTY_FAQ_PAYLOAD } from "@/features/contact/faq-types";
import { emptyLegalDocument } from "@/features/legal/types";
import type {
  GovernorateId,
  Property,
  PropertyFilters,
  PropertyPurpose,
  PropertyTypeOption,
} from "@/features/properties/types";
import type { Post } from "@/features/blog/types";
import type { Service } from "@/features/services/types";
import {
  EMPTY_HOME_CONTENT,
  EMPTY_SITE_SETTINGS,
} from "@/features/settings/types";
import type { TeamMember } from "@/features/team/types";
import { EMPTY_PAGE_TEXTS } from "@/features/page-texts/types";

export type MockQuery = Record<string, string>;

type Resolver = (params: {
  /** Path segments after the collection, e.g. `["villa-bayan"]`. */
  segments: string[];
  query: MockQuery;
}) => unknown;

function limit<T>(items: T[], query: MockQuery): T[] {
  const value = Number(query.limit);
  return Number.isFinite(value) && value > 0 ? items.slice(0, value) : items;
}

function optionalNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function filterProperties(query: MockQuery): Property[] {
  const filters: PropertyFilters = {
    purpose: query.purpose as PropertyPurpose | undefined,
    kind: query.kind,
    city: query.city,
    governorate: query.governorate as GovernorateId | undefined,
    featured:
      query.featured === undefined
        ? undefined
        : query.featured === "true" || query.featured === "1",
    search: query.search,
    minPrice: optionalNumber(query.minPrice),
    maxPrice: optionalNumber(query.maxPrice),
  };

  const matched = properties.filter((property) => {
    if (filters.purpose && property.purpose !== filters.purpose) return false;
    if (filters.kind && property.kind !== filters.kind) return false;
    if (filters.city && property.city !== filters.city) return false;
    if (filters.governorate && property.governorate !== filters.governorate) {
      return false;
    }
    if (filters.featured !== undefined && property.featured !== filters.featured) {
      return false;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      if (property.price === null) return false;
      if (filters.minPrice !== undefined && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
        return false;
      }
    }
    if (filters.search) {
      const haystack =
        `${property.title} ${property.district} ${property.city}`.toLowerCase();
      if (!haystack.includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });

  return limit(matched, query);
}

function propertyTypes(): PropertyTypeOption[] {
  const byId = new Map<string, string>();
  for (const property of properties) byId.set(property.kind, property.kindLabel);
  return [...byId].map(([id, label]) => ({ id, label }));
}

function filterPosts(query: MockQuery): Post[] {
  const matched = query.category
    ? posts.filter((post) => post.category === query.category)
    : posts;
  return limit(matched, query);
}

function filterTeam(query: MockQuery): TeamMember[] {
  return limit(team, query);
}

function filterServices(query: MockQuery): Service[] {
  return limit(services, query);
}

/**
 * Maps a collection path to its resolver. `apiFetch` splits the requested
 * path into `/{collection}/{...segments}` and dispatches here.
 */
const resolvers: Record<string, Resolver> = {
  properties: ({ segments, query }) => {
    if (segments.length === 0) return filterProperties(query);
    const key = segments[0];
    return (
      properties.find((item) => item.slug === key || item.id === key) ?? null
    );
  },
  "property-types": () => propertyTypes(),
  team: ({ segments, query }) => {
    if (segments.length === 0) return filterTeam(query);
    const key = segments[0];
    return team.find((item) => item.slug === key || item.id === key) ?? null;
  },
  posts: ({ segments, query }) => {
    if (segments.length === 0) return filterPosts(query);
    const key = segments[0];
    return posts.find((item) => item.slug === key || item.id === key) ?? null;
  },
  services: ({ segments, query }) => {
    if (segments.length === 0) return filterServices(query);
    const key = segments[0];
    return services.find((item) => item.slug === key || item.id === key) ?? null;
  },
  /** Planned CMS endpoints — return empty-safe shapes until fixtures exist. */
  settings: () => EMPTY_SITE_SETTINGS,
  home: () => EMPTY_HOME_CONTENT,
  "page-texts": () => EMPTY_PAGE_TEXTS,
  faqs: () => EMPTY_FAQ_PAYLOAD,
  seo: () => null,
  legal: ({ segments }) => {
    const slug = segments[0];
    if (slug === "privacy") return privacyDocument;
    if (slug === "terms") return termsDocument;
    return null;
  },
};

/** `true` when the path has a fixture behind it. */
export function hasMock(path: string): boolean {
  const [collection] = path.replace(/^\//, "").split("/");
  return collection in resolvers;
}

/**
 * Resolve a fixture for `path`.
 *
 * @throws When the collection is unknown — that means an endpoint was added
 *   without a fixture, which should fail loudly in development.
 */
export function resolveMock(path: string, query: MockQuery = {}): unknown {
  const [collection, ...segments] = path.replace(/^\//, "").split("/");
  const resolver = resolvers[collection];

  if (!resolver) {
    throw new Error(
      `No mock fixture registered for "${path}". Add one in mocks/registry.ts.`,
    );
  }

  return resolver({ segments: segments.filter(Boolean), query });
}

/** Empty value used by the forced `empty` state. */
export function emptyMock(path: string): unknown {
  const segments = path.replace(/^\//, "").split("/").filter(Boolean);
  const collection = segments[0];

  if (collection === "settings") return EMPTY_SITE_SETTINGS;
  if (collection === "home") return EMPTY_HOME_CONTENT;
  if (collection === "faqs") return EMPTY_FAQ_PAYLOAD;
  if (collection === "seo") return null;
  if (collection === "contact") return { ok: true };
  if (collection === "legal") {
    const slug = segments[1];
    if (slug === "privacy" || slug === "terms") {
      return emptyLegalDocument(slug);
    }
    return null;
  }

  return segments.length > 1 ? null : [];
}
