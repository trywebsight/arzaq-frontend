/**
 * Runtime env resolution.
 *
 * Server / Docker prefers non-public names (`MOCK_MODE`, `API_URL`,
 * `DEMO_MODE`, …). `NEXT_PUBLIC_*` remains as a fallback (local `.env` /
 * legacy). Docker bakes Dokploy **Build Time Arguments** into the image via
 * `ARG`/`ENV`; `docker-entrypoint.sh` also promotes aliases when unset.
 *
 * Access env via dynamic keys so production server code is not locked to
 * build-time `NEXT_PUBLIC_*` string replacements.
 */

/** Read `process.env[name]` without a static `process.env.NEXT_PUBLIC_*` member access. */
function env(name: string): string | undefined {
  return process.env[name];
}

function firstEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = env(name);
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
}

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
 * API URL is ignored while mocks are on — mock mode always wins.
 *
 * Resolution order:
 * 1. `MOCK_MODE` (runtime, preferred in Docker)
 * 2. `USE_MOCKS` (runtime legacy alias)
 * 3. `NEXT_PUBLIC_MOCK_MODE`
 * 4. `NEXT_PUBLIC_USE_MOCKS`
 * 5. Default `true` so local DX needs no env file
 */
export function resolveMockMode(): boolean {
  const mockMode = envFlag(firstEnv("MOCK_MODE", "NEXT_PUBLIC_MOCK_MODE"));
  if (mockMode !== undefined) return mockMode;

  const useMocks = envFlag(firstEnv("USE_MOCKS", "NEXT_PUBLIC_USE_MOCKS"));
  if (useMocks !== undefined) return useMocks;

  return true;
}

/** Absolute API origin. Ignored while mock mode is on. */
export function resolveApiBaseUrl(): string {
  return (firstEnv("API_URL", "NEXT_PUBLIC_API_URL") ?? "").replace(/\/$/, "");
}

/**
 * Optional dedicated media CDN host (informational / build-time patterns).
 * Runtime `next/image` also allows any https host via `hostname: "**"` in
 * `next.config.ts`, so changing media origin no longer requires a rebuild.
 */
export function resolveMediaHost(): string | undefined {
  const raw = firstEnv("MEDIA_HOST", "NEXT_PUBLIC_MEDIA_HOST")
    ?.trim()
    .replace(/\/+$/, "");
  return raw || undefined;
}

/** Artificial latency for the mock branch, in milliseconds. */
export function resolveMockDelay(): number {
  const raw = firstEnv("MOCK_DELAY", "NEXT_PUBLIC_MOCK_DELAY");
  const n = raw === undefined ? NaN : Number(raw);
  return Number.isFinite(n) ? n : 350;
}

/**
 * Whether chrome logos swap to the Websight demo marks.
 *
 * Resolution order:
 * 1. `DEMO_MODE` (runtime, preferred in Docker)
 * 2. `NEXT_PUBLIC_DEMO_MODE`
 * 3. Default `false`
 */
export function resolveDemoMode(): boolean {
  return envFlag(firstEnv("DEMO_MODE", "NEXT_PUBLIC_DEMO_MODE")) ?? false;
}
