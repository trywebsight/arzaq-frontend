export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

/** `GET /faqs` payload. */
export type FaqPayload = {
  categories: FaqCategory[];
};

export const EMPTY_FAQ_PAYLOAD: FaqPayload = { categories: [] };
