import { queryOptions } from "@tanstack/react-query";

import { fetchSeoOverride } from "@/features/seo/api";
import type { SeoPageKey } from "@/features/seo/types";
import { queryKeys } from "@/lib/query/keys";

export const seoQuery = (pageKey: SeoPageKey) =>
  queryOptions({
    queryKey: queryKeys.seo.detail(pageKey),
    queryFn: ({ signal }) => fetchSeoOverride(pageKey, signal),
  });
