/**
 * Forced data states.
 *
 * Every UI state the sections must render can be reproduced without touching
 * code — either globally with `MOCK_STATE` / `NEXT_PUBLIC_MOCK_STATE`, or per
 * page load with the `?mockState=` query parameter.
 *
 * | state     | behaviour                                        |
 * | --------- | ------------------------------------------------ |
 * | `ok`      | fixtures resolve normally (default)              |
 * | `loading` | requests never settle — the skeleton stays up    |
 * | `error`   | requests reject with an `ApiError`               |
 * | `empty`   | requests resolve with an empty collection        |
 * | `slow`    | fixtures resolve after a long, visible delay     |
 */

export const MOCK_STATES = ["ok", "loading", "error", "empty", "slow"] as const;

export type MockState = (typeof MOCK_STATES)[number];

/** Query parameter that overrides the state for a single page load. */
export const MOCK_STATE_PARAM = "mockState";

function env(name: string): string | undefined {
  return process.env[name];
}

function normalise(value: string | null | undefined): MockState | undefined {
  if (!value) return undefined;
  return (MOCK_STATES as readonly string[]).includes(value)
    ? (value as MockState)
    : undefined;
}

/** Parse a raw mock-state string (query / header). */
export function parseMockState(
  value: string | null | undefined,
): MockState | undefined {
  return normalise(value);
}

/** State configured via env. Defaults to `ok`. */
export function envMockState(): MockState {
  return (
    normalise(env("MOCK_STATE")) ??
    normalise(env("NEXT_PUBLIC_MOCK_STATE")) ??
    "ok"
  );
}

/**
 * Read the forced state from a Server Component's `searchParams`.
 *
 * Use this in the page so the server prefetch and the client agree — see
 * `shouldPrefetch()`.
 */
export function mockStateFromSearchParams(
  searchParams?: Record<string, string | string[] | undefined>,
): MockState {
  const raw = searchParams?.[MOCK_STATE_PARAM];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return normalise(value) ?? envMockState();
}

/**
 * The state that applies to the *current* request.
 *
 * On the server only the env var is visible (unless a caller passes an
 * override into `apiFetch`); in the browser the query parameter wins.
 */
export function currentMockState(): MockState {
  if (typeof window === "undefined") return envMockState();
  const param = new URLSearchParams(window.location.search).get(
    MOCK_STATE_PARAM,
  );
  return normalise(param) ?? envMockState();
}

/**
 * Server prefetching must be skipped whenever a non-default state is forced,
 * otherwise hydrated data would immediately overwrite the state under test
 * (or, for `loading`, hang the render).
 */
export function shouldPrefetch(state: MockState): boolean {
  return state === "ok";
}
