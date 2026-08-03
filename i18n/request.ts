import { getRequestConfig } from "next-intl/server";

/**
 * The single locale this site ships in.
 *
 * The app deliberately uses next-intl *without* i18n routing: there is no
 * `[locale]` segment, no middleware/proxy and no locale cookie. Adding a
 * second language later is a routing config change, not a rewrite.
 */
export const locale = "ar" as const;

/** IETF tag used for `<html lang>`, `Intl.*` formatting and OpenGraph. */
export const htmlLang = "ar";

/** Text direction for `<html dir>`. */
export const direction = "rtl" as const;

/** Locale used for number/date formatting. `ar-KW` keeps Western digits. */
export const formattingLocale = "ar-KW";

export default getRequestConfig(async () => ({
  locale,
  messages: (await import("../messages/ar.json")).default,
  // Kuwaiti convention: Western digits everywhere, so never switch the
  // numbering system to arab-indic.
  formats: {
    number: {
      currency: {
        style: "currency",
        currency: "KWD",
        maximumFractionDigits: 0,
      },
    },
  },
}));
