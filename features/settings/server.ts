import { cache } from "react";

import { fetchHomeContent, fetchSettings } from "@/features/settings/api";
import {
  EMPTY_HOME_CONTENT,
  EMPTY_SITE_SETTINGS,
  type HomeContent,
  type SiteSettings,
} from "@/features/settings/types";

/**
 * Per-request settings fetch with empty-safe fallback.
 * Deduped via React `cache` across footer, metadata and JSON-LD.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return await fetchSettings();
  } catch {
    return EMPTY_SITE_SETTINGS;
  }
});

/**
 * Per-request home content fetch with empty-safe fallback.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  try {
    return await fetchHomeContent();
  } catch {
    return EMPTY_HOME_CONTENT;
  }
});
