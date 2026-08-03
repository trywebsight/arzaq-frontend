import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SeoOverride, SeoPageKey } from "@/features/seo/types";

/** GET /seo/{pageKey} — `null` when no CMS override exists. */
export function fetchSeoOverride(
  pageKey: SeoPageKey,
  signal?: AbortSignal,
): Promise<SeoOverride> {
  return apiFetch<SeoOverride>(endpoints.seo(pageKey), {
    signal,
    nullOn404: true,
  });
}
