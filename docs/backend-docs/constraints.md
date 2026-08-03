# Contracts & constraints

Validation limits for Filament **and** frontend so neither side breaks layout or SEO. Enforce on the API; mirror in Filament `->maxLength()` / image rules.

## Slugs

| Rule | Value |
| --- | --- |
| Pattern | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Max length | 80 |
| Unique | Per resource type |
| Immutable | Prefer stable after publish (301 if changed) |

## Enums (exact)

**PropertyPurpose:** `sale` | `rent` | `exchange`  
**PropertyKind:** `villa` | `apartment` | `floor` | `land` | `building` | `office` | `chalet`  
**GovernorateId:** `asimah` | `hawalli` | `farwaniya` | `mubarak` | `ahmadi` | `jahra`  
**SocialKey:** `instagram` | `whatsapp` | `x`

Unknown enum values must not be returned; draft rows stay unpublished.

## Text length limits

| Field | Max chars | UI behaviour if exceeded |
| --- | --- | --- |
| Property / post `title` | 120 | `line-clamp-2` on cards; still store ≤120 |
| Property / post `excerpt` | 280 | `line-clamp-3` on cards; used as meta description |
| Service `title` | 80 | |
| Service `description` | 400 | |
| Team `name` | 80 | |
| Team `role` | 80 | |
| Post section `title` | 120 | |
| Post section `body` | 5000 | |
| Image `alt` | 160 | |
| SEO `title` | 60 (soft) / 70 hard | SERP truncation |
| SEO `description` | 160 (soft) / 200 hard | |
| Contact `name` | 80 | |
| Contact `message` | 2000 | min 10 |
| FAQ question | 160 | |
| FAQ answer | 2000 | |
| Legal section `title` | 120 | |
| Legal paragraph / list item | 4000 | Prefer shorter; UI is long-form prose |
| Legal `intro` | 800 | |
| Legal `metaTitle` | 70 | |
| Legal `metaDescription` | 200 | |
| `kindLabel` / `city` / `district` | 80 | |
| `address` | 160 | |

## Numbers & digits

- Prices, areas, bedrooms, stats: JSON **numbers** (not strings).
- Display: Western digits (`en-US` / `latn`) — Gulf convention.
- `price: null` allowed (price on request).
- `area` ≥ 0; reject negative.

## Phone

| Context | Format |
| --- | --- |
| Contact form `phone` | National Western digits only |
| Contact form `country` | ISO alpha-2 from curated list (KW default) |
| Stored / `phoneHref` | E.164 in `tel:+…` |
| WhatsApp | `https://wa.me/{digitsWithoutPlus}` |
| Display `phone` | e.g. `(+965) 555-5555` |

## Image dimensions & aspects

| Slot | Target aspect | Min width | Notes |
| --- | --- | --- | --- |
| Property card / list | 16:10 | 800 | Cropped `object-cover` |
| Property detail hero | 16:10 (md+) / 4:3 (mobile) | 1200 | |
| Property gallery | 4:3 display | 800 | |
| Blog card | 16:10 | 800 | |
| Article hero | 16:10 / 21:9 | 1200 | |
| Service card | ~5:4 | 640 | |
| Team portrait | 1:1 | 504 | Prefer transparent/black-bg cutouts |
| Home hero | ~3:2 or wider | 1600 | Full-bleed |
| OG / Twitter | **1.91:1 → 1200×630** | 1200 | Hard requirement for overrides |

Max upload (suggested Filament): **5 MB** per image; WebP/JPEG/PNG.

Always return intrinsic `width` / `height` matching the file.

## Required vs optional (published)

**Must be present to publish:** id, slug, titles, excerpts/descriptions as per resource, enums, `featured` boolean, `publishedAt`, primary image (recommended), contact object for properties/team.

**Optional:** `address`, `floors`, `garage`, `gallery`, post section titles, SEO overrides, home hero CMS fields.

## Empty responses (must not crash frontend)

| Response | OK? |
| --- | --- |
| `[]` for any list | Yes |
| `null` detail | Yes |
| `gallery: []` | Yes |
| `sections: []` | Yes (legal docs + articles) |
| Legal `null` | Yes (empty state) |
| `image: null` | Yes (placeholder UI) — avoid for published |
| Omitting required keys | **No** — breaks TypeScript assumptions |
| `204` on GET list | **No** |

## Pagination (current frontend)

Client slices property results into pages of **6**. API may ignore `page`/`perPage` until adopted; `limit` is already honored by mocks and client fetchers.
