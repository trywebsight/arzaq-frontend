import type { ImageAsset } from "@/lib/assets";

/** One block in an article body — intro (no title) or a headed section. */
export type PostSection = {
  /** Bold section heading. Omit for the opening lede paragraph. */
  title?: string;
  /** Arabic body copy for this block. */
  body: string;
};

export type Post = {
  id: string;
  slug: string;
  /** Arabic headline. */
  title: string;
  /** Two-to-three sentence Arabic summary. */
  excerpt: string;
  /** Arabic category label, e.g. "نصائح البيع". */
  category: string;
  /** Cover image. Null/missing src → muted placeholder. */
  image: ImageAsset | null;
  /** ISO 8601 date string. Format with `ar-KW` and Western digits. */
  publishedAt: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  author: {
    name: string;
    role: string;
  };
  /**
   * Structured article body for `/blog/[slug]`.
   * First item is typically untitled intro; later items carry `title`.
   */
  sections: PostSection[];
};

export type PostFilters = {
  category?: string;
  /** Maximum number of results. */
  limit?: number;
};
