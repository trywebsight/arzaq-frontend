import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { HomeContent, SiteSettings } from "@/features/settings/types";

/** GET /settings */
export function fetchSettings(signal?: AbortSignal): Promise<SiteSettings> {
  return apiFetch<SiteSettings>(endpoints.settings, { signal });
}

/** GET /home */
export function fetchHomeContent(signal?: AbortSignal): Promise<HomeContent> {
  return apiFetch<HomeContent>(endpoints.home, { signal });
}
