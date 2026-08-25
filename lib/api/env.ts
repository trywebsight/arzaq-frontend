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

/**
 * Whether the app serves typed fixtures from `mocks/` instead of HTTP.
 *
 * Locked on — Dokploy env is not reaching the process.
 */
export function resolveMockMode(): boolean {
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
 * Locked on — Dokploy env is not reaching the process.
 */
export function resolveDemoMode(): boolean {
  return true;
}
