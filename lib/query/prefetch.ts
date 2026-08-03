import { dehydrate, type DehydratedState } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query/get-query-client";
import {
  mockStateFromSearchParams,
  shouldPrefetch,
} from "@/lib/api/mock-state";
import { latestPostsQuery } from "@/features/blog/queries";
import { faqsQuery } from "@/features/contact/faq-queries";
import { featuredPropertiesQuery } from "@/features/properties/queries";
import { servicesQuery } from "@/features/services/queries";
import {
  homeContentQuery,
  settingsQuery,
} from "@/features/settings/queries";
import { resolveHomeLimits } from "@/features/settings/merge";
import { EMPTY_HOME_CONTENT } from "@/features/settings/types";
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
      queryClient.prefetchQuery(settingsQuery()),
      queryClient.prefetchQuery(homeContentQuery()),
    ]);

    const home =
      queryClient.getQueryData(homeContentQuery().queryKey) ??
      EMPTY_HOME_CONTENT;
    const limits = resolveHomeLimits(home);

    await Promise.all([
      queryClient.prefetchQuery(
        featuredPropertiesQuery(limits.featuredPropertyLimit),
      ),
      queryClient.prefetchQuery(servicesQuery({ limit: limits.servicesLimit })),
      queryClient.prefetchQuery(teamQuery({ limit: limits.teamLimit })),
      queryClient.prefetchQuery(latestPostsQuery(limits.latestPostsLimit)),
    ]);
  }

  return dehydrate(queryClient);
}

/**
 * Warm the team + settings queries for the About page.
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
    await Promise.all([
      queryClient.prefetchQuery(teamQuery()),
      queryClient.prefetchQuery(settingsQuery()),
    ]);
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

/**
 * Warm FAQ query for the Contact page.
 *
 * @example
 * const state = await prefetchContactQueries(await searchParams);
 */
export async function prefetchContactQueries(
  searchParams?: Record<string, string | string[] | undefined>,
): Promise<DehydratedState> {
  const queryClient = getQueryClient();
  const mockState = mockStateFromSearchParams(searchParams);

  if (shouldPrefetch(mockState)) {
    await queryClient.prefetchQuery(faqsQuery());
  }

  return dehydrate(queryClient);
}
