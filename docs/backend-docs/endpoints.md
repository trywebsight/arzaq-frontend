# Endpoint catalog

Paths are relative to `NEXT_PUBLIC_API_URL` and mirror `lib/api/endpoints.ts`.

Field names match `features/*/types.ts` unless noted.

---

## Properties

### `GET /properties`

List published listings.

**Query**

| Param | Type | Notes |
| --- | --- | --- |
| `purpose` | `sale` \| `rent` \| `exchange` | |
| `kind` | `villa` \| `apartment` \| `floor` \| `land` \| `building` \| `office` \| `chalet` | |
| `city` | string | Exact match on Arabic city label (legacy); prefer `governorate` |
| `governorate` | `asimah` \| `hawalli` \| `farwaniya` \| `mubarak` \| `ahmadi` \| `jahra` | Listing UI maps URL `city` → this filter |
| `featured` | `true` \| `false` | |
| `search` | string | Match title, district, city |
| `minPrice` | number | Inclusive; exclude `price: null` rows when set |
| `maxPrice` | number | Inclusive; exclude `price: null` rows when set |
| `limit` | number | Max items |
| `page` | number | Optional future server pagination |
| `perPage` | number | Optional future server pagination |

**Empty**

```json
[]
```

**Populated (truncated)**

```json
[
  {
    "id": "prp-001",
    "slug": "villa-sharq-kuwait-city",
    "title": "للبيع: فيلا في منطقة الكويت الشرقية",
    "excerpt": "منزل حديث البناء بتصميم عصري…",
    "purpose": "sale",
    "kind": "villa",
    "kindLabel": "فيلا",
    "governorate": "asimah",
    "city": "مدينة الكويت",
    "district": "الشرق",
    "address": "3050، مدينة الكويت، الكويت",
    "area": 750,
    "price": 850000,
    "bedrooms": 6,
    "bathrooms": 7,
    "floors": 3,
    "garage": 2,
    "image": {
      "src": "https://cdn.example/media/villa.jpg",
      "width": 1056,
      "height": 560,
      "alt": "فيلا بمسبح"
    },
    "gallery": [],
    "featured": true,
    "contact": {
      "phone": "(+965) 555-5555",
      "phoneHref": "tel:+9655555555",
      "whatsappHref": "https://wa.me/9655555555?text=..."
    },
    "publishedAt": "2026-06-18"
  }
]
```

Frontend price buckets (URL `price=` id only — **not** sent to API today; mapped to `minPrice`/`maxPrice`):

| Id | min | max |
| --- | --- | --- |
| `0-1000` | 0 | 1000 |
| `1000-200000` | 1000 | 200000 |
| `200000-500000` | 200000 | 500000 |
| `500000-800000` | 500000 | 800000 |
| `800000-` | 800000 | open |

### `GET /properties/{idOrSlug}`

**Empty / missing:** `null` (200) or `404` (see overview).

---

## Team

### `GET /team`

| Param | Type |
| --- | --- |
| `limit` | number |

**Empty:** `[]`

### `GET /team/{idOrSlug}`

Member or `null` / `404`.

---

## Blog (posts)

### `GET /posts`

| Param | Type |
| --- | --- |
| `category` | string (exact Arabic label today) |
| `limit` | number |

**Empty:** `[]`

### `GET /posts/{slug}`

Post or `null` / `404`. Include `sections: []` when body not yet written — detail page renders no body blocks (does not crash).

---

## Services

### `GET /services`

| Param | Type |
| --- | --- |
| `limit` | number |

**Empty:** `[]`

### `GET /services/{slug}`

Service or `null` / `404`.

---

## Contact

### `POST /contact`

**Body** (matches contact form + Zod schema)

```json
{
  "name": "أحمد",
  "email": "ahmad@example.com",
  "country": "KW",
  "phone": "55555555",
  "message": "أرغب بالاستفسار عن فيلا في بيان"
}
```

| Field | Rules |
| --- | --- |
| `name` | trim, min 2 |
| `email` | valid email |
| `country` | ISO 3166-1 alpha-2 from curated list (default `KW`) |
| `phone` | Western national digits only; validated with libphonenumber for `country` |
| `message` | trim, min 10 |

**Success**

```json
{ "ok": true }
```

**422** — standard Laravel validation errors.

Store E.164 server-side via country + national digits; do not require the client to send E.164.

---

## FAQ (planned)

### `GET /faqs`

Returns categories with items. **Empty:**

```json
{ "categories": [] }
```

**Populated**

```json
{
  "categories": [
    {
      "id": "sellers",
      "title": "للبائعين",
      "items": [
        {
          "id": "timing",
          "question": "…",
          "answer": "…"
        }
      ]
    }
  ]
}
```

Until wired, the site reads FAQ from `messages/ar.json` + `features/contact/content.ts`.

---

## Settings

### `GET /settings`

Global site settings marketers edit without deploys. **Partial / empty:**

```json
{
  "contact": null,
  "socials": [],
  "heroStats": []
}
```

See [seo-and-settings.md](./seo-and-settings.md).

---

## Home

### `GET /home`

Aggregated homepage CMS block. **Empty / unset sections:**

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

Featured properties / services / team / posts still come from their collection endpoints with `featured` / `limit` — home endpoint only overrides copy, hero media, and limits.

---

## SEO

### `GET /seo/{pageKey}`

`pageKey` examples: `home`, `about`, `properties`, `services`, `team`, `blog`, `contact`, `privacy`, `terms`, or `properties:{slug}`, `posts:{slug}`.

**Empty (use frontend message fallbacks):**

```json
null
```

or

```json
{
  "title": null,
  "description": null,
  "ogImage": null
}
```

See [seo-and-settings.md](./seo-and-settings.md).

---

## Legal documents

### `GET /legal/privacy`

### `GET /legal/terms`

CMS-managed long-form legal pages. Shape: `LegalDocument` in `features/legal/types.ts`.

**Accept-Language:** required (see [i18n.md](./i18n.md)). Return the locale variant; Arabic first.

**Empty / unpublished**

```json
null
```

or

```json
{
  "slug": "privacy",
  "eyebrow": "",
  "title": "",
  "updatedAt": "",
  "intro": null,
  "metaTitle": null,
  "metaDescription": null,
  "sections": [],
  "contact": null
}
```

Frontend treats `null` or `sections: []` as empty state (no crash).

**Populated (truncated)**

```json
{
  "slug": "privacy",
  "eyebrow": "سياسة الخصوصية",
  "title": "سياسة الخصوصية",
  "updatedAt": "2026-01-01",
  "intro": "توضح سياسة الخصوصية هذه…",
  "metaTitle": "سياسة الخصوصية",
  "metaDescription": "تعرف على كيفية جمع…",
  "contact": {
    "email": "email@example.com",
    "emailHref": "mailto:email@example.com",
    "phone": "(+965) 555-5555",
    "phoneHref": "tel:+9655555555",
    "websiteUrl": "https://arzaq.com.kw"
  },
  "sections": [
    {
      "id": "general",
      "title": "الأحكام العامة",
      "blocks": [
        { "type": "paragraph", "text": "…" }
      ]
    },
    {
      "id": "collect",
      "title": "ما نجمعه",
      "blocks": [
        { "type": "list", "items": ["…", "…"] }
      ]
    },
    {
      "id": "contacts",
      "title": "جهات التواصل",
      "blocks": [
        { "type": "paragraph", "text": "…" },
        {
          "type": "contacts",
          "emailLabel": "البريد الإلكتروني",
          "phoneLabel": "الهاتف",
          "websiteLabel": null
        }
      ]
    }
  ]
}
```

**Block types:** `paragraph` | `list` | `contacts` (labels in payload; hrefs from `contact` or site settings fallback).

Frontend routes `/privacy` and `/terms` already consume these endpoints via mocks.

---

## Summary table

| Method | Path | Used today | Notes |
| --- | --- | --- | --- |
| GET | `/properties` | Yes | Filters |
| GET | `/properties/{idOrSlug}` | Yes | |
| GET | `/team` | Yes | |
| GET | `/team/{idOrSlug}` | Ready | |
| GET | `/posts` | Yes | |
| GET | `/posts/{slug}` | Yes | |
| GET | `/services` | Yes | |
| GET | `/services/{slug}` | Ready | |
| POST | `/contact` | Yes | |
| GET | `/faqs` | Planned | |
| GET | `/settings` | Planned | |
| GET | `/home` | Planned | |
| GET | `/seo/{pageKey}` | Planned | |
| GET | `/legal/privacy` | Yes (mocks) | CMS body |
| GET | `/legal/terms` | Yes (mocks) | CMS body |
