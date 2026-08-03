import type { ImageAsset } from "@/lib/assets";

export type Service = {
  id: string;
  slug: string;
  /** Arabic service name, e.g. "إدارة أملاك الغير". */
  title: string;
  /** Arabic description paragraph. */
  description: string;
  /** Card image. Null/missing src → muted placeholder. */
  image: ImageAsset | null;
};

export type ServiceFilters = {
  /** Maximum number of results. */
  limit?: number;
};
