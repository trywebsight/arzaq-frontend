import { queryOptions } from "@tanstack/react-query";

import { fetchHomeContent, fetchSettings } from "@/features/settings/api";
import { queryKeys } from "@/lib/query/keys";

export const settingsQuery = () =>
  queryOptions({
    queryKey: queryKeys.settings.detail(),
    queryFn: ({ signal }) => fetchSettings(signal),
  });

export const homeContentQuery = () =>
  queryOptions({
    queryKey: queryKeys.home.detail(),
    queryFn: ({ signal }) => fetchHomeContent(signal),
  });
