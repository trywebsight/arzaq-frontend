# Arzaq — Backend API handoff

**Audience:** Laravel / Filament engineers building the public marketing API.

This folder is a **self-contained** pack. Share it as-is (zip or clone path `docs/backend-docs/`). It is derived from the full project docs under `docs/` but omits frontend env / mock-mode details.

## Stack target

- **Laravel** public JSON API (no end-user auth)
- **Filament** admin for marketers
- Site is **Arabic-first, RTL**; API must support `Accept-Language` from day one

## Read order

| # | Doc | Purpose |
| --- | --- | --- |
| 1 | [overview.md](./overview.md) | Base URL, headers, errors, empty responses, caching |
| 2 | [endpoints.md](./endpoints.md) | Every method/path/query/body |
| 3 | [resources.md](./resources.md) | JSON field contracts (camelCase) |
| 4 | [i18n.md](./i18n.md) | `Accept-Language` rules |
| 5 | [seo-settings-home.md](./seo-settings-home.md) | SEO, settings, home CMS |
| 6 | [constraints.md](./constraints.md) | Length limits, enums, images, phones |
| 7 | [filament-laravel.md](./filament-laravel.md) | Models, media, publishing |
| 8 | [launch-checklist.md](./launch-checklist.md) | What “APIs ready” means |

## Endpoint priority

| Priority | Endpoints | Why |
| --- | --- | --- |
| **P0 — ship first** | `GET /properties`, `GET /properties/{idOrSlug}`, `GET /posts`, `GET /posts/{slug}`, `GET /team`, `GET /services`, `POST /contact`, `GET /legal/privacy`, `GET /legal/terms` | Frontend already consumes these (mocks today) |
| **P1** | `GET /team/{idOrSlug}`, `GET /services/{slug}` | Clients ready; no marketing routes yet |
| **P2** | `GET /faqs`, `GET /settings`, `GET /home`, `GET /seo/{pageKey}` | Types ready; UI still uses static fallbacks until wired |

## Hard rules (do not break the frontend)

1. **camelCase** public JSON matching [resources.md](./resources.md) — no raw `snake_case` without a mapper agreement.
2. Lists that are empty → **`200` + `[]`**, never `204`, never omit body.
3. Missing detail → **`404`** or **`200` + `null`** (document which; frontend maps both).
4. Unpublished / soft-deleted → **never** in public responses.
5. Images → absolute `https` URLs + `width` / `height` / `alt`.
6. Numbers as JSON numbers; display digits are Western **0–9**.
7. Empty launch is OK — UI has empty states. Prefer empty over inventing placeholder content.

## Non-goals for this pack

- Next.js env vars / mock mode (frontend team owns that)
- Filament UI pixel design
- Secrets / credentials
