import type { ImageAsset } from "@/lib/assets";

/** What the listing is offered for. */
export type PropertyPurpose = "sale" | "rent" | "exchange";

/** Property category. Drives the first chip on the card. */
export type PropertyKind =
  | "villa"
  | "apartment"
  | "floor"
  | "land"
  | "building"
  | "office"
  | "chalet";

/** Kuwait governorates used by listing filters and area pills. */
export type GovernorateId =
  | "asimah"
  | "hawalli"
  | "farwaniya"
  | "mubarak"
  | "ahmadi"
  | "jahra";

export type PropertyContact = {
  phone: string;
  phoneHref: string;
  whatsappHref: string;
};

export type Property = {
  id: string;
  slug: string;
  /** Arabic headline, e.g. "للبيع: فيلا في منطقة الكويت الشرقية". */
  title: string;
  /** One-paragraph Arabic summary shown on the card. */
  excerpt: string;
  purpose: PropertyPurpose;
  kind: PropertyKind;
  /** Ready-to-render Arabic label for the kind chip. */
  kindLabel: string;
  /** Governorate key used by listing filters and area pills. */
  governorate: GovernorateId;
  /** Governorate or city label, e.g. "مدينة الكويت". */
  city: string;
  /** District / block, e.g. "الشرق". */
  district: string;
  /** Built-up area in square metres. Render with the `م²` unit. */
  area: number;
  /** Asking price in Kuwaiti dinars. `null` means "price on request". */
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  /**
   * Street-style address for the detail hero overlay, e.g. "3050، مدينة الكويت، الكويت".
   * Optional so listing cards stay unaffected.
   */
  address?: string;
  /** Number of floors / storeys. Detail page only. */
  floors?: number | null;
  /** Covered parking / garage spaces. Detail page only. */
  garage?: number | null;
  /** Additional photos for the detail gallery. Falls back to `image` when empty. */
  gallery?: ImageAsset[];
  /** Primary photo. Null/missing src → muted placeholder (do not publish without one). */
  image: ImageAsset | null;
  /** Included in the home page "Featured properties" rail. */
  featured: boolean;
  contact: PropertyContact;
  /** ISO 8601 date string. */
  publishedAt: string;
};

/** Server-side filters. Every field is optional; omit for "everything". */
export type PropertyFilters = {
  purpose?: PropertyPurpose;
  kind?: PropertyKind;
  /** Exact match against `Property.city`. */
  city?: string;
  /** Match against `Property.governorate`. */
  governorate?: GovernorateId;
  featured?: boolean;
  /** Free-text match against title, district and city. */
  search?: string;
  /** Inclusive lower bound on asking price. Ignores null-priced listings. */
  minPrice?: number;
  /** Inclusive upper bound on asking price. Ignores null-priced listings. */
  maxPrice?: number;
  /** Maximum number of results. */
  limit?: number;
};
