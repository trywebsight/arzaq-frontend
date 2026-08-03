"use client";

import { LegalDocumentSection } from "@/features/legal";

/**
 * Privacy policy page body — content from `GET /legal/privacy`.
 */
export function PrivacySection({ className }: { className?: string }) {
  return (
    <LegalDocumentSection
      slug="privacy"
      headingId="privacy-heading"
      className={className}
    />
  );
}
