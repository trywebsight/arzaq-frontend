import { queryOptions } from "@tanstack/react-query";

import { fetchLegalDocument } from "@/features/legal/api";
import type { LegalDocumentSlug } from "@/features/legal/types";
import { queryKeys } from "@/lib/query/keys";

export const legalDocumentQuery = (slug: LegalDocumentSlug) =>
  queryOptions({
    queryKey: queryKeys.legal.detail(slug),
    queryFn: ({ signal }) => fetchLegalDocument(slug, signal),
  });
