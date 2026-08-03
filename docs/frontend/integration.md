# Frontend integration

## Env vars (finalized)

| Variable | Default | Meaning |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://arzaq.com.kw` (code fallback) | Canonical origin, sitemap, metadataBase |
| `NEXT_PUBLIC_API_URL` | `""` | API origin; used only when mocks are off |
| `NEXT_PUBLIC_MOCK_MODE` | *(unset)* | Preferred switch: `true` \| `false` |
| `NEXT_PUBLIC_USE_MOCKS` | `true` | Legacy alias — still supported |
| `NEXT_PUBLIC_MOCK_DELAY` | `350` | Mock latency (ms) |
| `NEXT_PUBLIC_MOCK_STATE` | `ok` | Force `ok` \| `loading` \| `error` \| `empty` \| `slow` |

### Mock mode resolution

Mocks are **on** unless explicitly disabled:

1. If `NEXT_PUBLIC_MOCK_MODE` is set → use it (`"false"` disables).
2. Else if `NEXT_PUBLIC_USE_MOCKS` is set → use it (`"false"` disables).
3. Else → mocks **on** (local DX with no `.env`).

```bash
# Local (default)
NEXT_PUBLIC_MOCK_MODE=true

# Production against Laravel
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_MOCK_MODE=false
```

Single choke point: `lib/api/client.ts` (`isMockMode` / `USE_MOCKS`). Feature `queries.ts` / hooks stay unchanged.

## What must not break

- Query keys from `lib/query/keys.ts` + `features/*/queries.ts`.
- Endpoint path strings in `lib/api/endpoints.ts` (backend must match).
- Arabic copy in `messages/ar.json` — no new Arabic in components.
- RTL rules in `AGENTS.md` (no `flex-row-reverse`).
- Five QueryState states on every data section.

## Empty states

| Case | Expected UI |
| --- | --- |
| List `[]` | `QueryEmptyState` (feature empty copy) |
| Detail `null` | Empty / not-found panel inside QueryState; route `notFound()` when prefetch knows it is missing |
| Missing `image.src` | Muted placeholder — no `next/image` crash |
| `gallery: []` | Detail uses primary image only |
| `sections: []` | Article body area simply empty |
| FAQ `{ categories: [] }` | Empty FAQ panel (when API-wired) |
| Legal `null` / `sections: []` | Empty legal panel (`LegalPage.empty`) |
| Settings nulls | Fall back to `lib/site.ts` / messages |
| SEO null | Fall back to `Meta.*` / entity fields / `LegalPage.*.meta` |

Force empty with `?mockState=empty` while mocks are on.

## Accept-Language

Real HTTP branch sends `Accept-Language` from `siteConfig.locale` (`ar`). Future locale switch updates that header in one place (`lib/api/client.ts`).

## Contact POST

Uses the shared client (`apiPost`) and the same mock-mode switch as GETs.

## Images from the API

1. API returns absolute `https://…` URLs with width/height/alt.
2. `next.config.ts` allows the API/media hostname via `images.remotePatterns` (derived from `NEXT_PUBLIC_API_URL` plus optional `NEXT_PUBLIC_MEDIA_HOST`).
3. Cards tolerate null images.

## Optional Laravel `{ data }` wrap

If the API wraps payloads, add/enable unwrap in `lib/api/client.ts` so features still receive `Property[]` / `Property`. Prefer unwrapped JSON to avoid this.

## 404 → null for details

When mock mode is off, detail fetchers should map HTTP 404 to `null` so `QueryState` / `generateMetadata` behave like mocks. List endpoints should not 404 for empty filters — return `[]`.

## CMS dual path

```
messages/ar.json + lib/site.ts     ←  UI chrome + defaults
GET /legal/privacy|terms           ←  legal body (wired today via mocks)
GET /settings, /home, /seo/*       ←  overrides when wired
```

Legal pages already render from `GET /legal/*`. Until settings/home/SEO are consumed in UI, changing those Filament settings will not affect the site — endpoints and types are prepared for a thin follow-up.

## Go-live steps

1. Deploy API with CORS allowing the Next origin (browser contact POST; server components call API from Node — CORS irrelevant for RSC GETs).
2. Set env on the Next host.
3. Confirm `pnpm build` with mocks off against staging (or keep mocks on for preview deploys).
4. Seed or accept empty states (including unpublished legal docs).
5. Smoke listing, detail, contact, privacy, terms, sitemap.