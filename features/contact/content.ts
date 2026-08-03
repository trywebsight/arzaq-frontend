/**
 * FAQ category and item ids mapped to `ContactPage.faq.categories.*` keys.
 */
export type FaqCategoryId = "sellers" | "buyers";

export type FaqItemId =
  | "timing"
  | "simultaneous"
  | "prepare"
  | "marketing"
  | "beforeSelling"
  | "timeline"
  | "inspection"
  | "offer";

export type FaqCategory = {
  id: FaqCategoryId;
  items: readonly FaqItemId[];
};

/** Ordered FAQ groups for the contact page accordion. */
export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    id: "sellers",
    items: ["timing", "simultaneous", "prepare", "marketing"],
  },
  {
    id: "buyers",
    items: ["beforeSelling", "timeline", "inspection", "offer"],
  },
] as const;
