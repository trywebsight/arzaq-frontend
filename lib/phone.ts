import {
  type CountryCode,
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

/** Default dial region for Websight (Kuwait). */
export const DEFAULT_PHONE_COUNTRY: CountryCode = "KW";

/**
 * Curated ISO regions for the contact phone selector — Gulf first, then
 * common caller origins. Structural only; no Arabic labels.
 */
export const PHONE_COUNTRIES = [
  "KW",
  "SA",
  "AE",
  "BH",
  "OM",
  "QA",
  "EG",
  "JO",
  "IQ",
  "LB",
  "SY",
  "YE",
  "TR",
  "IN",
  "PK",
  "GB",
  "US",
  "FR",
  "DE",
] as const satisfies readonly CountryCode[];

export type PhoneCountry = (typeof PHONE_COUNTRIES)[number];

export type PhoneCountryOption = {
  code: PhoneCountry;
  dialCode: string;
  /** Unicode regional-indicator flag emoji (e.g. 🇰🇼). */
  flag: string;
  /** Trigger / list label, e.g. `🇰🇼 +965`. */
  label: string;
};

/**
 * Builds a flag emoji from an ISO 3166-1 alpha-2 code via regional
 * indicator symbols. Zero assets; dial code / ISO remain the accessible text.
 *
 * @param countryCode - Two-letter region, e.g. `"KW"`.
 *
 * @example
 * countryFlagEmoji("KW") // "🇰🇼"
 */
export function countryFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  const A = "A".charCodeAt(0);
  const RI = 0x1f1e6;
  return String.fromCodePoint(
    ...[...code].map((ch) => RI + (ch.charCodeAt(0) - A)),
  );
}

/**
 * Returns dial-code options for the phone country Select.
 *
 * @example
 * getPhoneCountryOptions()[0]
 * // { code: "KW", dialCode: "965", flag: "🇰🇼", label: "🇰🇼 +965" }
 */
export function getPhoneCountryOptions(): PhoneCountryOption[] {
  return PHONE_COUNTRIES.map((code) => {
    const dialCode = getCountryCallingCode(code);
    const flag = countryFlagEmoji(code);
    return {
      code,
      dialCode,
      flag,
      label: `${flag} +${dialCode}`,
    };
  });
}

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

/**
 * Maps Arabic-Indic digits to Western 0–9 and strips all non-digits
 * (Gulf convention: Western digits only).
 *
 * @param value - Raw input, possibly with spaces or Arabic-Indic digits.
 */
export function westernDigitsOnly(value: string): string {
  return value
    .replace(/[٠-٩]/g, (ch) => String(ARABIC_INDIC.indexOf(ch)))
    .replace(/[^\d]/g, "");
}

/**
 * Narrows an unknown string to a supported phone country, else default KW.
 *
 * @param value - Candidate ISO 3166-1 alpha-2 code.
 */
export function asPhoneCountry(value: string): CountryCode {
  if (isSupportedCountry(value) && PHONE_COUNTRIES.includes(value as PhoneCountry)) {
    return value;
  }
  return DEFAULT_PHONE_COUNTRY;
}

/**
 * Whether `national` is a valid number for `country` (libphonenumber-js).
 *
 * @param national - National number, Western digits preferred.
 * @param country - ISO region used as default country.
 */
export function isValidNationalPhone(
  national: string,
  country: CountryCode,
): boolean {
  const digits = westernDigitsOnly(national);
  if (!digits) return false;
  return isValidPhoneNumber(digits, country);
}

/**
 * Formats a national number + country as E.164, or `undefined` if invalid.
 *
 * @param national - National number digits.
 * @param country - ISO region.
 *
 * @example
 * toE164("55555555", "KW") // "+96555555555"
 */
export function toE164(
  national: string,
  country: CountryCode,
): string | undefined {
  const digits = westernDigitsOnly(national);
  if (!digits) return undefined;
  const parsed = parsePhoneNumberFromString(digits, country);
  if (!parsed?.isValid()) return undefined;
  return parsed.format("E.164");
}
