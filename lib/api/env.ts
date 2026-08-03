/**
 * Public env switches for the data layer.
 *
 * Prefer `NEXT_PUBLIC_MOCK_MODE`. `NEXT_PUBLIC_USE_MOCKS` remains as a legacy
 * alias so existing deploys keep working.
 */

function envFlag(value: string | undefined): boolean | undefined {
  if (value === undefined || value === "") return undefined;
  const normalised = value.toLowerCase();
  if (normalised === "false" || normalised === "0" || normalised === "off") {
    return false;
  }
  if (normalised === "true" || normalised === "1" || normalised === "on") {
    return true;
  }
  return undefined;
}

/**
 * Whether the app serves typed fixtures from `mocks/` instead of HTTP.
 *
 * `NEXT_PUBLIC_API_URL` is ignored while mocks are on — mock mode always wins.
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_MOCK_MODE` (`true`/`false`, also `1`/`0`/`on`/`off`)
 * 2. `NEXT_PUBLIC_USE_MOCKS` (legacy alias)
 * 3. Default `true` so local DX needs no env file
 */
export function resolveMockMode(): boolean {
  const mockMode = envFlag(process.env.NEXT_PUBLIC_MOCK_MODE);
  if (mockMode !== undefined) return mockMode;

  const useMocks = envFlag(process.env.NEXT_PUBLIC_USE_MOCKS);
  if (useMocks !== undefined) return useMocks;

  return true;
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
