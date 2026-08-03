"use client";

import { LegalDocumentSection } from "@/features/legal";

/**
 * Terms of service page body — content from `GET /legal/terms`.
 * CTA band stays enabled via SiteShell — do not mount `OptOutCta` here.
 */
export function TermsContent({ className }: { className?: string }) {
  return (
    <LegalDocumentSection
      slug="terms"
      headingId="terms-heading"
      className={className}
    />
  );
}
