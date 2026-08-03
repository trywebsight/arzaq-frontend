# Arzaq — API & integration docs

Planning docs for wiring the Next.js marketing site to a **Laravel + Filament** backend. The frontend already talks through `lib/api/client.ts` and typed fixtures in `mocks/`. Going live should be mostly **env flips**, not schema rewrites.

## Share with backend

**→ [backend-docs/](./backend-docs/)** — self-contained handoff pack (endpoints, resources, i18n, constraints, Filament notes, launch checklist). Zip or send that folder only.

## How to read (full set)

| Doc | Audience | Purpose |
| --- | --- | --- |
| [backend-docs/](./backend-docs/) | **Backend (share this)** | Everything needed to build the API |
| [api/overview.md](./api/overview.md) | Backend + frontend | Base URL, auth, errors, pagination, empty responses |
| [api/endpoints.md](./api/endpoints.md) | Backend | Full method/path/query/body catalog |
| [api/resources.md](./api/resources.md) | Backend | JSON shapes aligned to `features/*/types.ts` |
| [api/seo-and-settings.md](./api/seo-and-settings.md) | Backend + CMS | Dynamic SEO, site settings, home content |
| [api/i18n.md](./api/i18n.md) | Backend | `Accept-Language` from day one (Arabic first) |
| [backend/filament-laravel.md](./backend/filament-laravel.md) | Backend | Models, Filament resources, media, soft deletes |
| [frontend/integration.md](./frontend/integration.md) | Frontend | Env vars, mock mode, empty states |
| [contracts/constraints.md](./contracts/constraints.md) | Both | Length limits, image ratios, slugs, enums, phones |

## Current frontend data surface

| Domain | List | Detail | Notes |
| --- | --- | --- | --- |
| Properties | `GET /properties` | `GET /properties/{idOrSlug}` | Filters + client-side page size 6 |
| Team | `GET /team` | `GET /team/{idOrSlug}` | |
| Blog | `GET /posts` | `GET /posts/{slug}` | |
| Services | `GET /services` | `GET /services/{slug}` | |
| Contact | — | `POST /contact` | Form submit |
| FAQ | planned `GET /faqs` | — | Copy lives in `messages/ar.json` today |
| Legal | `GET /legal/privacy`, `GET /legal/terms` | — | CMS body; UI chrome in `LegalPage` messages |
| Settings / home | planned `GET /settings`, `GET /home` | — | Hero stats / contact / socials in `lib/site.ts` today |
| SEO | planned `GET /seo/{page}` | — | Fallback: `messages/ar.json` → `Meta.*` / `LegalPage.*.meta` |

## Go-live checklist (short)

1. Filament publishes content (or leave lists empty — UI must not crash).
2. Set `NEXT_PUBLIC_API_URL` to the API origin (no trailing slash required).
3. Set `NEXT_PUBLIC_MOCK_MODE=false` (or `NEXT_PUBLIC_USE_MOCKS=false`).
4. Ensure API host is allowed in Next.js `images.remotePatterns` (see [frontend/integration.md](./frontend/integration.md)).
5. Confirm empty collections return `[]` and missing details return `null` / `404` as documented.
6. Smoke: `/?mockState=empty`, listing pages, detail 404, contact submit.

## Non-goals

- No secrets in these docs.
- No inventing Arabic copy in components — CMS/API may override; UI chrome defaults stay in `messages/ar.json`.
