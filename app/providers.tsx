"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query/get-query-client";
import { siteConfig } from "@/lib/site";
import { DirectionProvider } from "@/components/ui/direction";

const ReactQueryDevtools = React.lazy(() =>
  import("@tanstack/react-query-devtools").then((mod) => ({
    default: mod.ReactQueryDevtools,
  })),
);

/**
 * Client-side providers for the whole app.
 *
 * `getQueryClient()` is called during render rather than in a `useState`
 * initialiser on purpose: on the server it returns a fresh client per request,
 * in the browser it returns the singleton.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={siteConfig.direction}>{children}</DirectionProvider>
      {process.env.NODE_ENV === "development" ? (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </React.Suspense>
      ) : null}
    </QueryClientProvider>
  );
}
