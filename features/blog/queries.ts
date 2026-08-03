import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { fetchPost, fetchPosts } from "@/features/blog/api";
import type { PostFilters } from "@/features/blog/types";

export const postsQuery = (filters: PostFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.posts.list(filters),
    queryFn: ({ signal }) => fetchPosts(filters, signal),
  });

/** The home page grid. Defaults to the three most recent articles. */
export const latestPostsQuery = (limit = 3) => postsQuery({ limit });

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.posts.detail(slug),
    queryFn: ({ signal }) => fetchPost(slug, signal),
  });
