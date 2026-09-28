import type { ImageAsset } from "@/lib/assets";

/** What the listing is offered for. */
export type PropertyPurpose = "sale" | "rent" | "exchange";

/**
 * Property category id. Live data uses the dashboard property type id (e.g. `"13"`);
 * fixtures use readable keys (e.g. `"villa"`). Render `kindLabel`, never the id.
 */
export type PropertyKind = string;

/** One option of the property type filter, from `GET /property-types`. */
export type PropertyTypeOption = {
  id: string;
  label: string;
};

/** Hosted property video. */
export type PropertyVideo = {
  src: string;
  /** MIME type, e.g. `video/mp4` or `video/quicktime`. */
  type: string;
};

/** Map pin: the exact property when `coordinatesExact`, otherwise the neighbourhood centre. */
export type PropertyCoordinates = {
  lat: number;
  lng: number;
};

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
  governorate: GovernorateId | null;
  /** Ready-to-render governorate name, e.g. "محافظة حولي". */
  governorateLabel?: string | null;
  /** Governorate or city label, e.g. "مدينة الكويت". */
  city: string;
  /** District / block, e.g. "الشرق". */
  district: string;
  /** Built-up area in square metres. Render with the `م²` unit. `null` when unknown. */
  area: number | null;
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
  /** Office reference shown to visitors, e.g. "SD0078". */
  code?: string | null;
  /** Full description. Detail page only; cards use `excerpt`. */
  description?: string | null;
  /** Number of apartments (investment buildings). */
  apartments?: number | null;
  /** Building condition label, e.g. "جديد". */
  condition?: string | null;
  /** Plot position label, e.g. "زاوية". */
  plotPosition?: string | null;
  /** Monthly rental income in Kuwaiti dinars. */
  monthlyIncome?: number | null;
  /** Gross annual return in percent, e.g. `7.03`. */
  annualReturn?: number | null;
  video?: PropertyVideo | null;
  coordinates?: PropertyCoordinates | null;
  /** `true` when `coordinates` is the property's own pin rather than its area. */
  coordinatesExact?: boolean;
  /** PACI Kuwait Finder link for the exact address. */
  kuwaitFinderUrl?: string | null;
  /** Additional photos for the detail gallery. Falls back to `image` when empty. */
  gallery?: ImageAsset[];
  /** Primary photo. Null/missing src → muted placeholder (do not publish without one). */
  image: ImageAsset | null;
  /** Included in the home page "Featured properties" rail. */
  featured: boolean;
  contact: PropertyContact;
  /** ISO 8601 date string. */
  publishedAt: string;
  /** ISO 8601 date string of the last edit. */
  updatedAt?: string;
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
