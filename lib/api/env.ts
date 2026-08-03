/**
 * Public env switches for the data layer.
 *
 * Prefer `NEXT_PUBLIC_MOCK_MODE`. `NEXT_PUBLIC_USE_MOCKS` remains as a legacy
 * alias so existing deploys keep working.
 */

/**
 * Whether the app serves typed fixtures from `mocks/` instead of HTTP.
 *
 * TEMPORARY: always returns `false` so staging hits the live API while we
 * validate the backend. `NEXT_PUBLIC_MOCK_MODE` / `NEXT_PUBLIC_USE_MOCKS` are
 * ignored until this force is removed.
 *
 * Restore later — resolution order:
 * 1. `NEXT_PUBLIC_MOCK_MODE` (`true`/`false`, also `1`/`0`/`on`/`off`)
 * 2. `NEXT_PUBLIC_USE_MOCKS` (legacy alias)
 * 3. Default `true` so local DX needs no env file
 */
export function resolveMockMode(): boolean {
  // Temporary hard-off for live backend testing — ignore mock env flags.
  return false;
}

/** Absolute API origin. Ignored while mock mode is on. */
export function resolveApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

/** Optional dedicated media CDN host for `next/image` remotePatterns. */
export function resolveMediaHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_MEDIA_HOST?.trim();
  return raw || undefined;
}
