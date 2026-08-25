/**
 * Satori / `ImageResponse` Arabic helpers.
 *
 * Satori shapes each Arabic word (joining + presentation forms) but places
 * words on the line left-to-right. CSS `direction: "rtl"` is a no-op for text
 * runs in the bundled engine and must not be used — it does not fix order and
 * confuses flex layout expectations.
 *
 * Reversing whitespace-separated tokens before render yields the correct
 * right-to-left visual order while keeping glyph joining intact.
 */

const ARABIC_SCRIPT = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

/**
 * True when `text` contains Arabic-script letters.
 *
 * @param text - Any string.
 */
export function containsArabic(text: string): boolean {
  return ARABIC_SCRIPT.test(text);
}

/**
 * Prepare copy for Satori so multi-word Arabic reads correctly right-to-left.
 * Latin-only strings are returned unchanged. Trailing sentence punctuation is
 * kept on the visual end (left) as its own token so it is not glued inside a word.
 *
 * @param text - Logical (storage-order) Arabic or mixed string.
 * @example
 * satoriRtlText("ويبسايت العقارية") // → "العقارية ويبسايت" for LTR word placement
 */
export function satoriRtlText(text: string): string {
  if (!text || !containsArabic(text)) return text;

  const trimmed = text.trim();
  const punctMatch = trimmed.match(/[.!?…]+$/u);
  const punct = punctMatch?.[0] ?? "";
  const body = punct ? trimmed.slice(0, -punct.length).trim() : trimmed;
  const words = body.split(/\s+/).filter(Boolean).reverse();

  if (punct) {
    // Leading in the LTR string → leftmost after layout = RTL sentence end.
    return [punct, ...words].join(" ");
  }
  return words.join(" ");
}
