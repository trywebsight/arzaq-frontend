import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { FaqPayload } from "@/features/contact/faq-types";

/** GET /faqs — empty launch: `{ categories: [] }`. */
export function fetchFaqs(signal?: AbortSignal): Promise<FaqPayload> {
  return apiFetch<FaqPayload>(endpoints.faqs, { signal });
}
