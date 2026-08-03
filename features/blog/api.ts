import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Post, PostFilters } from "@/features/blog/types";

/** GET /posts */
export function fetchPosts(
  filters: PostFilters = {},
  signal?: AbortSignal,
): Promise<Post[]> {
  return apiFetch<Post[]>(endpoints.posts, {
    signal,
    searchParams: { category: filters.category, limit: filters.limit },
  });
}

/** GET /posts/:slug — resolves to `null` when not found. */
export function fetchPost(
  slug: string,
  signal?: AbortSignal,
): Promise<Post | null> {
  return apiFetch<Post | null>(endpoints.post(slug), {
    signal,
    nullOn404: true,
  });
}
