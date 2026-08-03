import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/** One minute — long enough that prefetched data is not refetched on mount. */
export const DEFAULT_STALE_TIME = 60_000;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Ship still-pending queries so streamed prefetches keep working.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * A `QueryClient` scoped correctly for the App Router.
 *
 * - **Server**: a brand new client per request, so no cache is ever shared
 *   between users.
 * - **Browser**: a singleton, so React state survives Suspense and re-renders.
 *
 * @example
 * // Server Component
 * const queryClient = getQueryClient();
 * await queryClient.prefetchQuery(featuredPropertiesQuery());
 * return <HydrationBoundary state={dehydrate(queryClient)}>…</HydrationBoundary>;
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
