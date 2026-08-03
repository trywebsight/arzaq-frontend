import { Cairo } from "next/font/google";

/**
 * Cairo is the site's only typeface: it carries a full Arabic set plus Latin
 * glyphs, so headings, body copy and Western digits all share one family.
 *
 * The CSS variable is `--font-cairo` so `@theme inline` can map it to
 * `--font-sans` / `--font-heading` without a circular self-reference.
 */
export const fontSans = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
  // Latin fallback while Cairo loads; keeps CLS low for the mixed-script UI.
  fallback: ["system-ui", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

/** Class list to spread onto `<html>`. */
export const fontVariables = fontSans.variable;
