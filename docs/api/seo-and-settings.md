# SEO and site settings

Marketers change meta and homepage content in Filament without redeploying Next.js. The frontend always keeps **static Arabic fallbacks** in `messages/ar.json` (`Meta.*`, page namespaces) and structural defaults in `lib/site.ts`.

## Dual path (required)

```
API override (if non-null)  →  messages/ar.json / lib/site.ts fallback
```

Never leave the site without a title/description: `generateMetadata` must merge API → messages.

## Page keys

| `pageKey` | Route | Message fallback |
| --- | --- | --- |
| `home` | `/` | `Meta.title`, `Meta.description` |
| `about` | `/about` | page `Meta` / About namespace as implemented |
| `properties` | `/properties` | `Meta.properties.*` |
| `services` | `/services` | Services page meta |
| `team` | `/team` | `Meta.team.*` |
| `blog` | `/blog` | Blog meta |
| `contact` | `/contact` | Contact meta |
| `privacy` | `/privacy` | Privacy meta |
| `terms` | `/terms` | Terms meta |
| `properties:{slug}` | `/properties/[slug]` | Property `title` + `excerpt`, else not-found meta |
| `posts:{slug}` | `/blog/[slug]` | Post `title` + `excerpt` |

## `GET /seo/{pageKey}`

### Empty / no override

```http
HTTP/1.1 200 OK

null
```

Frontend uses messages + entity fields for details.

### Partial override

```json
{
  "title": "عنوان مخصص لصفحة العقارات",
  "description": null,
  "ogImage": null
}
```

Null fields fall back individually.

### Full override

```json
{
  "title": "…",
  "description": "…",
  "ogImage": {
    "src": "https://cdn.example/og/properties.jpg",
    "width": 1200,
    "height": 630,
    "alt": "…"
  },
  "robots": null
}
```

### Detail pages

For `properties:{slug}` / `posts:{slug}`, Filament may store per-entity SEO columns on the model instead of a separate table. Either:

- expose them only on the detail resource (`title`/`excerpt`/`image` already feed metadata today), or  
- also expose via `/seo/properties:{slug}` for marketing overrides that differ from the card title.

**Current frontend (no SEO API yet):** detail metadata uses entity `title` + `excerpt` + `image`; listing/static pages use `buildPageMetadata` + `Meta.*`. Default brand card: `/og.png` (rewrites to `/opengraph-image`, 1200×630 PNG).

## `GET /settings`

Controls global contact, socials, hero stats. Empty example:

```json
{
  "contact": null,
  "socials": [],
  "heroStats": []
}
```

When `contact` is null, frontend keeps `CONTACT` from `lib/site.ts`. When `socials` / `heroStats` are empty arrays, same fallbacks.

## `GET /home`

Hero image/copy and section limits. Empty:

```json
{
  "hero": null,
  "aboutTeaser": null,
  "featuredPropertyLimit": 3,
  "latestPostsLimit": 3,
  "servicesLimit": 4,
  "teamLimit": 6
}
```

**Do not** embed full property/post arrays here — use collection endpoints so QueryState + query keys stay coherent.

## Sitemap / robots

- `app/sitemap.ts` already pulls property + post slugs via the data layer; empty API → static routes only (try/catch already).
- `app/robots.ts` stays config-driven unless you add a settings flag later (`indexingEnabled`).

## JSON-LD

Built client/server from entities + messages (`lib/seo.ts`). Empty featured list → omit ItemList (`null`). No separate SEO API field required for schema.org.
