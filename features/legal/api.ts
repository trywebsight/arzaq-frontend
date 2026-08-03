import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { LegalDocument, LegalDocumentSlug } from "@/features/legal/types";

/** GET /legal/:slug — `null` when unpublished / 404. */
export function fetchLegalDocument(
  slug: LegalDocumentSlug,
  signal?: AbortSignal,
): Promise<LegalDocument | null> {
  return apiFetch<LegalDocument | null>(endpoints.legal(slug), {
    signal,
    nullOn404: true,
  });
}
