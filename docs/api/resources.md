# Resource shapes

JSON field names **match** TypeScript in `features/*/types.ts` and `lib/assets.ts` (`ImageAsset`). Prefer camelCase as shown — do not emit `snake_case` to the public API without a frontend mapper.

## ImageAsset

```ts
{
  src: string;    // Absolute https URL (live) or site-relative path (mocks)
  width: number;  // Intrinsic px — required for next/image when not using fill alone
  height: number;
  alt: string;    // Arabic alt; may be "" but prefer real text (max length in constraints)
}
```

**Missing image on a published entity:** send `null` for `image` only if unpublished drafts leak — preferred rule: **do not publish** without an image. Frontend still guards null/missing `src` with a muted placeholder.

**Empty gallery:** `"gallery": []` or omit (`undefined`). Detail falls back to primary `image`.

---

## Property

Aligns to `features/properties/types.ts`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Stable public id |
| `slug` | string | yes | URL segment; see constraints |
| `title` | string | yes | Arabic headline |
| `excerpt` | string | yes | Card / meta description source |
| `purpose` | enum | yes | `sale` \| `rent` \| `exchange` |
| `kind` | enum | yes | see endpoints |
| `kindLabel` | string | yes | Localized label for chips (respect `Accept-Language`) |
| `governorate` | enum | yes | Filter key |
| `city` | string | yes | Display locality |
| `district` | string | yes | May be `""` |
| `area` | number | yes | m²; Western digits in JSON number |
| `price` | number \| null | yes | `null` = price on request |
| `bedrooms` | number \| null | yes | |
| `bathrooms` | number \| null | yes | |
| `address` | string | no | Detail hero overlay |
| `floors` | number \| null | no | |
| `garage` | number \| null | no | |
| `gallery` | ImageAsset[] | no | |
| `image` | ImageAsset \| null | yes\* | \*Required to publish; frontend tolerates null |
| `featured` | boolean | yes | Home rail |
| `contact` | object | yes | See below |
| `publishedAt` | string | yes | ISO 8601 date or datetime |

### PropertyContact

```json
{
  "phone": "(+965) 555-5555",
  "phoneHref": "tel:+9655555555",
  "whatsappHref": "https://wa.me/9655555555"
}
```

Frontend may fall back to global `GET /settings` contact when per-listing contact is missing — until then always send the object.

---

## Post

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `slug` | string | yes |
| `title` | string | yes |
| `excerpt` | string | yes |
| `category` | string | yes |
| `image` | ImageAsset \| null | yes\* |
| `publishedAt` | string | yes |
| `readingMinutes` | number | yes |
| `author` | `{ name, role }` | yes |
| `sections` | `{ title?: string, body: string }[]` | yes (may be `[]`) |

---

## Service

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `slug` | string | yes |
| `title` | string | yes |
| `description` | string | yes |
| `image` | ImageAsset \| null | yes\* |

---

## TeamMember

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `slug` | string | yes |
| `name` | string | yes |
| `role` | string | yes |
| `image` | ImageAsset \| null | yes\* |
| `phone` | string | yes |
| `phoneHref` | string | yes |
| `whatsappHref` | string | yes |
| `email` | string | yes |

Portraits are often shot on black backgrounds — document for designers; no API flag required.

---

## ContactSubmitResponse

```json
{ "ok": true }
```

---

## Settings (planned)

```ts
type SiteSettings = {
  contact: {
    email: string;
    emailHref: string;
    phone: string;
    phoneHref: string;
    whatsappNumber: string; // digits only, no +
    whatsappHref: string;
    address?: string;
  } | null;
  socials: Array<{
    key: "instagram" | "whatsapp" | "x";
    href: string;
  }>;
  heroStats: Array<{
    key: string;
    value: number;
    suffix: string;
    label?: string; // if omitted, frontend uses messages `Hero.stats.{key}.label`
  }>;
};
```

---

## HomeContent (planned)

```ts
type HomeContent = {
  hero: {
    eyebrow?: string | null;
    title?: string | null;
    image: ImageAsset | null;
    imageAlt?: string | null;
  } | null;
  aboutTeaser: {
    eyebrow?: string | null;
    title?: string | null;
    body?: string | null;
  } | null;
  featuredPropertyLimit: number;
  latestPostsLimit: number;
  servicesLimit: number;
  teamLimit: number;
};
```

Unset strings → frontend keeps `messages/ar.json` / `lib/site.ts` defaults.

---

## SeoOverride (planned)

```ts
type SeoOverride = {
  title: string | null;
  description: string | null;
  ogImage: ImageAsset | null;
  robots?: { index?: boolean; follow?: boolean } | null;
} | null;
```

---

## FaqPayload (planned)

```ts
type FaqPayload = {
  categories: Array<{
    id: string;
    title: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  }>;
};
```

Empty: `{ "categories": [] }`.

---

## LegalDocument (`GET /legal/privacy` | `/legal/terms`)

```ts
type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | {
      type: "contacts";
      emailLabel: string;
      phoneLabel: string;
      websiteLabel?: string | null;
    };

type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

type LegalDocument = {
  slug: "privacy" | "terms";
  eyebrow: string;
  title: string;
  updatedAt: string; // YYYY-MM-DD
  intro: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: LegalSection[];
  contact: {
    email: string;
    emailHref: string;
    phone: string;
    phoneHref: string;
    websiteUrl?: string | null;
  } | null;
};
```

Empty: `null` or `sections: []`.