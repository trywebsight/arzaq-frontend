import { siteConfig } from "@/lib/site";

/**
 * Default headers for public API calls.
 * `Accept-Language` is sent from day one even though the UI is Arabic-only.
 */
export function apiDefaultHeaders(
  extra?: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": siteConfig.locale,
  };

  if (!extra) return headers;

  const merged = new Headers(headers);
  new Headers(extra).forEach((value, key) => {
    merged.set(key, value);
  });

  const out: Record<string, string> = {};
  merged.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}
