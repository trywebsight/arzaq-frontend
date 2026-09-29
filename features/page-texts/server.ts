import { cache } from "react";

import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { EMPTY_PAGE_TEXTS, type PageTexts } from "@/features/page-texts/types";

/** Seconds a dashboard edit may take to appear on the website. */
const REVALIDATE_SECONDS = 60;

/**
 * Dashboard page texts, deduped per request and cached for a minute across
 * requests. Any failure falls back to the website defaults.
 */
export const getPageTexts = cache(async (): Promise<PageTexts> => {
  try {
    const data = await apiFetch<PageTexts>(endpoints.pageTexts, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return {
      texts: data?.texts ?? {},
      images: { ...EMPTY_PAGE_TEXTS.images, ...data?.images },
    };
  } catch {
    return EMPTY_PAGE_TEXTS;
  }
});
