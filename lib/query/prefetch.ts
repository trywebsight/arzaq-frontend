import { dehydrate, type DehydratedState } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query/get-query-client";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { latestPostsQuery } from "@/features/blog/queries";
import { featuredPropertiesQuery } from "@/features/properties/queries";
import { servicesQuery } from "@/features/services/queries";
import { teamQuery } from "@/features/team/queries";

/**
 * Warm the cache for everything the home page renders and return the
 * dehydrated state for `<HydrationBoundary>`.
 *
 * Prefetching is skipped whenever a forced mock state is active, otherwise
 * hydrated data would immediately overwrite the state being reviewed (and
 * `?mockState=loading` would hang the server render).
 *
 * @example
 * export default async function Page({ searchParams }: PageProps) {
 *   const state = await prefetchHomeQueries(await searchParams);
 *   return <HydrationBoundary state={state}>…</HydrationBoundary>;
 * }
 */
export async function prefetchHomeQueries(
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await Promise.all([
      queryClient.prefetchQuery(featuredPropertiesQuery(3)),
      queryClient.prefetchQuery(servicesQuery({ limit: 2 })),
      queryClient.prefetchQuery(teamQuery()),
      queryClient.prefetchQuery(latestPostsQuery()),
    ]);
  }

  return dehydrate(queryClient);
}

/**
 * Warm the team query for the About page and return dehydrated state.
 *
 * @example
 * const state = await prefetchAboutQueries(await searchParams);
 */
export async function prefetchAboutQueries(
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(teamQuery());
  }

  return dehydrate(queryClient);
}

/**
 * Warm the team query for the Team listing page and return dehydrated state.
 *
 * @example
 * const state = await prefetchTeamQueries(await searchParams);
 */
export async function prefetchTeamQueries(
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(teamQuery());
  }

  return dehydrate(queryClient);
}

/**
 * Warm the services list for the Services page and return dehydrated state.
 *
 * @example
 * const state = await prefetchServicesQueries(await searchParams);
 */
export async function prefetchServicesQueries(
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(servicesQuery());
  }

  return dehydrate(queryClient);
}
