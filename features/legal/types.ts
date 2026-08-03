/**
 * CMS-managed legal pages (`GET /legal/privacy`, `GET /legal/terms`).
 * All display copy for the document body comes from the API — not `messages`.
 */

export type LegalDocumentSlug = "privacy" | "terms";

export type LegalContactBlock = {
  type: "contacts";
  emailLabel: string;
  phoneLabel: string;
  /** When set, render a website row. */
  websiteLabel?: string | null;
};

export type LegalParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type LegalListBlock = {
  type: "list";
  items: string[];
};

export type LegalBlock =
  | LegalParagraphBlock
  | LegalListBlock
  | LegalContactBlock;

export type LegalSection = {
  /** Stable id for keys / anchors (e.g. `general`, `collect`). */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

/** Optional contact values for `contacts` blocks; fall back to site settings. */
export type LegalDocumentContact = {
  email: string;
  emailHref: string;
  phone: string;
  phoneHref: string;
  websiteUrl?: string | null;
};

/**
 * Full legal document payload.
 * Empty launch: `sections: []` (and optionally blank title) — UI shows empty state.
 */
export type LegalDocument = {
  slug: LegalDocumentSlug;
  eyebrow: string;
  title: string;
  /** ISO date `YYYY-MM-DD` (Western digits in UI). */
  updatedAt: string;
  intro: string | null;
  /** Prefer over message fallbacks when non-null. */
  metaTitle: string | null;
  metaDescription: string | null;
  sections: LegalSection[];
  contact: LegalDocumentContact | null;
};

export function emptyLegalDocument(slug: LegalDocumentSlug): LegalDocument {
  return {
    slug,
    eyebrow: "",
    title: "",
    updatedAt: "",
    intro: null,
    metaTitle: null,
    metaDescription: null,
    sections: [],
    contact: null,
  };
}

export function isLegalDocumentEmpty(doc: LegalDocument | null | undefined): boolean {
  if (!doc) return true;
  return doc.sections.length === 0;
}
