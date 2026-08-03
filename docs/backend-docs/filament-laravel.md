# Laravel + Filament notes

Suggested backend shape for the public API consumed by Next.js. Adjust naming to house style; keep **public JSON** aligned to [resources.md](../api/resources.md).

## Stack suggestions

- Laravel 11+ API routes (`routes/api.php`) or a dedicated `/api` prefix.
- Filament 3.x admin for marketers.
- Spatie Media Library (or Filament file upload → disk) for images.
- Spatie Translatable (or JSON columns) for `Accept-Language` — see [i18n.md](../api/i18n.md).
- Optional: Spatie Response Cache / HTTP `Cache-Control` on public GETs.

## Models (suggested)

| Model | Filament resource | Public endpoints |
| --- | --- | --- |
| `Property` | Properties | `/properties`, `/properties/{idOrSlug}` |
| `TeamMember` | Team | `/team`, `/team/{idOrSlug}` |
| `Post` | Blog posts | `/posts`, `/posts/{slug}` |
| `Service` | Services | `/services`, `/services/{slug}` |
| `ContactSubmission` | Read-only inbox | `POST /contact` creates row + optional mail |
| `FaqCategory` / `FaqItem` | FAQ | `/faqs` |
| `SiteSetting` | Settings (singleton) | `/settings` |
| `HomePage` | Home (singleton) | `/home` |
| `SeoMeta` | SEO per page key | `/seo/{pageKey}` |
| `LegalDocument` | Privacy / Terms (two records or polymorphic) | `/legal/privacy`, `/legal/terms` |

Property detail SEO can be columns on `Property` instead of `SeoMeta`.

Legal documents store **fully resolved Arabic (and future locale) body** as structured blocks — not message keys. Filament: repeater for sections → blocks (`paragraph` / `list` / `contacts`).
## Publishing & soft deletes

- Use `published_at` / `status: draft|published` — public API returns **published only**.
- Soft deletes (`deleted_at`): exclude from all public queries.
- Featured flag: `featured` boolean on `Property`.

## Media

| Use | Collection name (example) | Aspect (see constraints) |
| --- | --- | --- |
| Property card / OG | `image` | ~16:10 (e.g. 1056×560) |
| Property gallery | `gallery` | 4:3 display crop OK |
| Post cover | `image` | ~16:10 |
| Service | `image` | ~5:4 card crop |
| Team portrait | `image` | 1:1 (~656×652) |
| Hero | `hero` on Home | full-bleed ~3:2 or wider |
| OG override | `og` | **1200×630** |

API `ImageAsset.src` must be an **absolute HTTPS URL** the Next.js image optimizer can fetch. Configure `images.remotePatterns` for the media host.

Always include `width`, `height`, and `alt` in the JSON (derive width/height from the stored media).

## Contact form

- Validate with Form Request mirroring [constraints](../contracts/constraints.md).
- Rate-limit by IP (`429`).
- Persist submission; notify via mail / Filament database notifications.
- Convert `country` + `phone` → E.164 for storage; response remains `{ "ok": true }`.

## Empty-state expectations (launch day)

It is expected that many collections start empty:

| Endpoint | Empty body |
| --- | --- |
| List endpoints | `[]` |
| Detail missing | `404` or `null` |
| `/faqs` | `{ "categories": [] }` |
| `/settings` | nullables / `[]` as in resources |
| `/home` | `hero: null`, etc. |
| `/seo/{key}` | `null` |
| `/legal/privacy`, `/legal/terms` | `null` or `sections: []` |

Frontend `QueryState` renders empty panels for `[]` and null details — **do not** return `500` for “no rows”.
## Filament UX tips

- Enforce slug format on save (auto from title with manual override).
- Show character counters for title/excerpt/description (match constraints).
- Preview image aspect ratio in the upload component.
- Enum selects for `purpose`, `kind`, `governorate` — same values as TS unions.
- Western digit hint on price/phone fields.
- “Published” toggle separate from “Featured”.

## API resources

Use Eloquent API Resources that **output camelCase** matching TS (Laravel `Resource::wrap(null)` to avoid `{data:}` if you want zero frontend mapper). If you keep wrapping, document and enable the frontend unwrap helper.
