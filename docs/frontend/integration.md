# Frontend integration

## Env vars (finalized)

| Variable | Default | Runtime? | Meaning |
| --- | --- | --- | --- |
| `SITE_URL` | *(unset)* | **Yes** (also bake at Docker build) | Public origin (preferred). metadataBase, canonicals, sitemap, `og:image` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Build fallback | Used when `SITE_URL` is unset; Docker entrypoint also promotes it → `SITE_URL` |
| `API_URL` | `""` | **Yes** (also bake at Docker build) | API origin when mocks are off (preferred in Dokploy) |
| `NEXT_PUBLIC_API_URL` | `""` | Via entrypoint | Alias; promoted to `API_URL` at container start |
| `MOCK_MODE` | *(unset → on)* | **Yes** (also bake at Docker build) | `true` \| `false` (preferred in Dokploy) |
| `NEXT_PUBLIC_MOCK_MODE` | *(unset → on)* | Via entrypoint | Alias; promoted to `MOCK_MODE` at container start |
| `USE_MOCKS` / `NEXT_PUBLIC_USE_MOCKS` | *(legacy)* | Yes / via entrypoint | Legacy mock switch |
| `MEDIA_HOST` / `NEXT_PUBLIC_MEDIA_HOST` | *(unset)* | Informational | CDN hint; `next/image` allows any http(s) host via `hostname: "**"` (build-time pattern, runtime hosts OK) |
| `MOCK_DELAY` / `NEXT_PUBLIC_MOCK_DELAY` | `350` | **Yes** | Mock latency (ms) |
| `MOCK_STATE` / `NEXT_PUBLIC_MOCK_STATE` | `ok` | **Yes** | Force `ok` \| `loading` \| `error` \| `empty` \| `slow` |
| `DEMO_MODE` | `false` | **Yes** (also bake at Docker build) | `true` swaps navbar / footer / OG logos for Websight demo marks |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | Via entrypoint | Alias; promoted to `DEMO_MODE` at container start |

### Runtime vs build (Dokploy)

Dokploy **Environment** vars are runtime-only. The Dockerfile must also see them as **Build Time Arguments** (`ARG` → `ENV`), then you **redeploy**. Restart / cache clear is not enough.

| Concern | Rebuild needed? | How to set |
| --- | --- | --- |
| Mock on/off + API origin | **Yes** on Docker — same keys in Environment **and** Build Time Arguments | `MOCK_MODE=false` + `API_URL=https://api…` (or `NEXT_PUBLIC_*` aliases) |
| Public site origin | **Yes** on Docker | `SITE_URL=https://…` |
| Demo logos (Websight) | **Yes** on Docker | `DEMO_MODE=true` (or `NEXT_PUBLIC_DEMO_MODE=true`) |
| CMS / Unsplash image hosts | **No** for `next/image` | Permissive `remotePatterns` (`hostname: "**"`). Optional `MEDIA_HOST` is documentation only |

Leave **Docker Build Stage** empty so the small `runner` image is what runs (not the npm `builder` stage).

`NEXT_PUBLIC_*` values are normally inlined at `pnpm build`. This app avoids that lock-in for the data layer by:

1. Reading **non-public** `MOCK_MODE` / `API_URL` / `SITE_URL` / `DEMO_MODE` first on the Node server.
2. `docker-entrypoint.sh` copying Dokploy `NEXT_PUBLIC_*` into those names when unset (build and start).
3. Browser TanStack Query / contact POST going through same-origin `/api/proxy/*` so the server resolves env (not a baked client constant).
4. Docker `ARG` + `ENV` so Dokploy build-time arguments are still in the running image.

### Mock mode resolution

Mocks are **on** unless explicitly disabled. API URL never overrides mock mode.

1. `MOCK_MODE` → else `USE_MOCKS` → else `NEXT_PUBLIC_MOCK_MODE` → else `NEXT_PUBLIC_USE_MOCKS`
2. Else → mocks **on** (local DX with no `.env`).

When mocks are off, `API_URL` or `NEXT_PUBLIC_API_URL` must be set or requests throw.

```bash
# Local (default)
NEXT_PUBLIC_MOCK_MODE=true

# Production against Laravel (Dokploy Environment + Build Time Arguments, then redeploy)
API_URL=https://api.example.com
MOCK_MODE=false
# Equivalent aliases still work:
# NEXT_PUBLIC_API_URL=https://api.example.com
# NEXT_PUBLIC_MOCK_MODE=false

# Staging / custom public host (Slack & WhatsApp og:image)
SITE_URL=https://example.com

# Demo / sales — Websight logos in the header, footer, and OG cards
DEMO_MODE=true
```

Single choke point: `lib/api/client.ts` (`resolveMockMode` / `apiFetch`). Feature `queries.ts` / hooks stay unchanged.

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

Uses the shared client (`apiPost`) and the same mock-mode switch as GETs. In the browser this goes through `/api/proxy/contact`.

## Images from the API

1. API returns absolute `https://…` URLs with `width` / `height` / `alt`, and optionally `blurDataURL` (LQIP for remote blur-up).
2. `next.config.ts` allows any http(s) hostname via `remotePatterns` (`hostname: "**"`), so CMS/CDN host changes do not require a rebuild.
3. UI uses `SmartImage` (`placeholder="blur"`). Local `/public` paths resolve LQIP from `lib/generated/blur-map.json`; remote images use CMS `blurDataURL` or a shimmer fallback.
4. Cards tolerate null images.

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

1. Deploy API with CORS allowing the Next origin (browser contact POST now uses same-origin proxy; CORS only matters if something calls the API directly from the browser).
2. Set **Environment** and **Build Time Arguments** on the Next host (`MOCK_MODE=false`, `API_URL=…`, `SITE_URL=…`) and redeploy.
3. Confirm empty states / smoke listing, detail, contact, privacy, terms, sitemap.
4. Seed or accept empty states (including unpublished legal docs).
