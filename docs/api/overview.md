# API overview

Public read API for the Arzaq marketing site, plus one public write endpoint for contact submissions. There is **no end-user auth** on the public site.

## Base URL

- Origin only, e.g. `https://api.arzaq.com.kw` or `https://arzaq.com.kw/api`.
- Frontend joins `NEXT_PUBLIC_API_URL` + path from `lib/api/endpoints.ts`.
- Do **not** include a trailing slash on the env value; the client strips one if present.
- Paths are versionless today (`/properties`). If you introduce `/v1`, either:
  - put `/v1` inside `NEXT_PUBLIC_API_URL`, or
  - change `endpoints` once — prefer URL-prefix so feature code stays untouched.

## Auth

| Surface | Auth |
| --- | --- |
| Public GET (properties, posts, team, services, settings, SEO, FAQ, home) | None |
| `POST /contact` | None (rate-limit + spam protection on Laravel) |
| Filament admin | Session / Filament auth — **not** called from Next.js |

Optional later: signed upload URLs, private draft previews via token query param. Out of scope for v1 public marketing.

## Headers (request)

| Header | Required | Notes |
| --- | --- | --- |
| `Accept: application/json` | Yes | Client always sends |
| `Accept-Language` | Yes (from day one) | See [i18n.md](./i18n.md). Default `ar` |
| `Content-Type: application/json` | POST only | Contact body |
| `X-Request-Id` | Optional | Echo in error bodies if useful |

## Response envelope

**Prefer shapes that match TypeScript types directly** (bare arrays / objects). That keeps go-live to env changes.

### Lists (preferred)

```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

or populated:

```json
[ { "id": "prp-001", "slug": "villa-bayan", "...": "..." } ]
```

### Optional Laravel Resource wrap

If you must return `{ "data": ... }`, the frontend may unwrap via a thin mapper in `lib/api` (see [frontend/integration.md](../frontend/integration.md)). Prefer **not** wrapping until needed.

Paginated lists (optional, future):

```json
{
  "data": [],
  "meta": {
    "currentPage": 1,
    "perPage": 6,
    "total": 0,
    "lastPage": 1
  }
}
```

Today the properties listing **fetches the filtered collection and paginates in the browser** (`PROPERTIES_PAGE_SIZE = 6`). Supporting `page` / `perPage` on the API is fine; the client can adopt later without changing field names.

### Detail not found

Prefer:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{ "message": "Not found" }
```

The frontend `fetchProperty` / `fetchPost` types allow `null`. Either:

1. Return **404** and let `apiFetch` throw `ApiError` (pages already catch for metadata and call `notFound()` when prefetch returns null), or  
2. Return **200** with JSON `null`.

Mocks use option 2 (`null`). For live API, **404 is fine** if list/detail fetchers map 404 → `null` (recommended; see integration doc). Until that mapper lands, returning `null` with 200 matches mocks exactly.

### Empty collections

Always `200` + `[]` — never omit the body, never `204` for list GETs the UI queries.

Optional homepage sections that are unset:

```json
{
  "hero": null,
  "stats": [],
  "featuredPropertyIds": []
}
```

## Errors

Non-2xx → frontend throws `ApiError` with `{ status, path, body }`.

Suggested Laravel JSON:

```json
{
  "message": "Human-readable summary",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

| Status | When |
| --- | --- |
| `400` | Malformed query |
| `404` | Unknown slug/id |
| `422` | Contact validation failure |
| `429` | Rate limit (contact) |
| `500` | Unexpected |

Arabic `message` strings are nice-to-have; the UI already has Arabic fallbacks in `messages/ar.json` → `Common.error.*`.

## Caching

Optional response headers for public GETs:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

Next.js also passes `next: { revalidate, tags }` on fetch. Soft-deleted / unpublished rows must **not** appear in public responses.

## Forced QA states (frontend-only)

Independent of the backend:

| Mechanism | Values |
| --- | --- |
| `NEXT_PUBLIC_MOCK_STATE` | `ok` \| `loading` \| `error` \| `empty` \| `slow` |
| `?mockState=` | Same; wins in the browser |

These work even when mock mode is off (loading/error still forced). Empty against a live API is best tested with a real empty database.

## Western digits

All numeric display values (prices, areas, phones in copy, stats) use **Western digits 0–9**, not Arabic-Indic. Gulf convention. See [constraints.md](../contracts/constraints.md).
