import type { ContactFormValues } from "@/features/contact/schema";
import { apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export type ContactSubmitResponse = {
  ok: true;
};

/**
 * Submits the contact form via the shared API client (mock or live).
 *
 * @param values - Validated form payload.
 */
export async function submitContact(
  values: ContactFormValues,
): Promise<ContactSubmitResponse> {
  return apiPost<ContactSubmitResponse, ContactFormValues>(
    endpoints.contact,
    values,
    { mockResult: { ok: true } },
  );
}
