/** First path segment allowlist for the same-origin `/api/proxy` BFF. */
const ALLOWED_ROOTS = new Set([
  "properties",
  "team",
  "posts",
  "services",
  "contact",
  "faqs",
  "settings",
  "home",
  "seo",
  "legal",
]);

/**
 * Whether a backend path may be forwarded through `/api/proxy`.
 *
 * @param path - Absolute API path, e.g. `/properties/foo`.
 */
export function isAllowedProxyPath(path: string): boolean {
  if (!path.startsWith("/") || path.includes("..") || path.includes("//")) {
    return false;
  }
  const root = path.split("/").filter(Boolean)[0];
  return Boolean(root && ALLOWED_ROOTS.has(root));
}
