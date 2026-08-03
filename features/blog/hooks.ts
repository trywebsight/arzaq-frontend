"use client";

import { useQuery } from "@tanstack/react-query";

import {
  latestPostsQuery,
  postQuery,
  postsQuery,
} from "@/features/blog/queries";
import type { PostFilters } from "@/features/blog/types";

export function usePosts(filters: PostFilters = {}) {
  return useQuery(postsQuery(filters));
}

export function useLatestPosts(limit = 3) {
  return useQuery(latestPostsQuery(limit));
}

export function usePost(slug: string) {
  return useQuery(postQuery(slug));
}
