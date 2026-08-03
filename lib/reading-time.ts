/**
 * Frontend reading-time estimates for Arabic article bodies.
 *
 * Computed from content (not API fields) so OG cards and the UI stay in sync
 * without backend changes. Western digits in the source still count as tokens.
 */

/** Native adult Arabic reading pace used for marketing articles. */
export const ARABIC_WORDS_PER_MINUTE = 180;

/**
 * Count whitespace-separated tokens in `text`.
 *
 * @param text - Plain Arabic (or mixed) copy.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate whole minutes to read `text` at Arabic blog pace.
 * Always returns at least 1 when there is any content.
 *
 * @param text - Plain body copy.
 * @param wordsPerMinute - Override pace (defaults to {@link ARABIC_WORDS_PER_MINUTE}).
 * @example
 * estimateReadingMinutes(sectionBodies.join(" "))
 */
export function estimateReadingMinutes(
  text: string,
  wordsPerMinute: number = ARABIC_WORDS_PER_MINUTE,
): number {
  const words = countWords(text);
  if (words === 0) return 1;
  const pace = wordsPerMinute > 0 ? wordsPerMinute : ARABIC_WORDS_PER_MINUTE;
  return Math.max(1, Math.ceil(words / pace));
}

export type ReadingTimeSource = {
  sections: ReadonlyArray<{ title?: string; body: string }>;
};

/**
 * Minutes to read a post from its structured `sections` (titles + bodies).
 * Ignores API `readingMinutes` — intentional frontend ownership.
 *
 * @param post - Article with `sections`.
 */
export function readingMinutesFromSections(post: ReadingTimeSource): number {
  const parts = post.sections.flatMap((section) => [
    section.title ?? "",
    section.body,
  ]);
  return estimateReadingMinutes(parts.join(" "));
}
