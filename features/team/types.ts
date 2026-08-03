import type { ImageAsset } from "@/lib/assets";

export type TeamMember = {
  id: string;
  slug: string;
  /** Arabic full name. */
  name: string;
  /** Arabic job title, e.g. "مستشار مبيعات". */
  role: string;
  /**
   * Portrait. All three source portraits are shot on a solid black
   * background — place them on a dark or gradient surface.
   * Null/missing src → muted placeholder.
   */
  image: ImageAsset | null;
  /** Display form, e.g. `(+965) 555-5555`. */
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
};

export type TeamFilters = {
  /** Maximum number of results. */
  limit?: number;
};
