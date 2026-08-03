import {
  currentMockState,
  MOCK_STATE_PARAM,
  type MockState,
} from "@/lib/api/mock-state";
import {
  resolveApiBaseUrl,
  resolveMockDelay,
  resolveMockMode,
} from "@/lib/api/env";
import { apiDefaultHeaders } from "@/lib/api/headers";
import { isAllowedProxyPath } from "@/lib/api/proxy-path";
import { emptyMock, resolveMock, type MockQuery } from "@/mocks/registry";

/**
 * The one file that knows where data comes from.
 *
 * Server / Docker: set `MOCK_MODE` + `API_URL` (or `NEXT_PUBLIC_*` aliases —
 * the image entrypoint promotes them). Client browser calls go through the
 * same-origin `/api/proxy` BFF so those runtime values apply without a rebuild.
 */

/** Latency used by the forced `slow` state. */
export const MOCK_SLOW_DELAY = 4000;

/** Re-reads env each call — not a build-time constant. */
export function isMockMode(): boolean {
  return resolveMockMode();
}

/** @deprecated Prefer `isMockMode()` / `resolveMockMode()`. */
export function getUseMocks(): boolean {
  return resolveMockMode();
}

/** Absolute API origin; re-reads env each call. */
export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export type QueryPrimitive = string | number | boolean | null | undefined;

export type ApiRequestInit = {
  /** Serialised onto the URL. `null`/`undefined` entries are dropped. */
  searchParams?: Record<string, QueryPrimitive>;
  signal?: AbortSignal;
  headers?: HeadersInit;
  /** Next.js fetch cache hints. Ignored by the mock branch. */
  next?: { revalidate?: number | false; tags?: string[] };
  /**
   * When true, HTTP 404 resolves to `null` instead of throwing.
   * Matches mock detail behaviour for live APIs.
   */
  nullOn404?: boolean;
  /**
   * Server-only override (used by `/api/proxy` so browser `?mockState=` applies).
   */
  mockState?: MockState;
};

/** Thrown for any non-2xx response, and by the forced `error` state. */
export class ApiError extends Error {
  readonly status: number;
  readonly path: string;
  readonly body: unknown;

  constructor(message: string, options: { status: number; path: string; body?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.path = options.path;
    this.body = options.body;
  }
}

function toQuery(
  searchParams: ApiRequestInit["searchParams"],
): { search: string; record: MockQuery } {
  const record: MockQuery = {};
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    // Laravel query validation accepts 1/0 reliably; bare "true"/"false"
    // strings 422 on some backends. Mocks accept both forms.
    const serialised =
      typeof value === "boolean" ? (value ? "1" : "0") : String(value);
    params.set(key, serialised);
    record[key] = serialised;
  }

  const search = params.toString();
  return { search: search ? `?${search}` : "", record };
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

/** Never settles. Backs the forced `loading` state. */
function forever(signal?: AbortSignal): Promise<never> {
  return new Promise((_resolve, reject) => {
    signal?.addEventListener(
      "abort",
      () => reject(new DOMException("Aborted", "AbortError")),
      { once: true },
    );
  });
}

/**
 * Unwrap Laravel-style `{ data, meta?, links? }` when present.
 * Bare arrays/objects matching TS types pass through unchanged.
 */
export function unwrapPayload<T>(json: unknown): T {
  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    return json as T;
  }

  const record = json as Record<string, unknown>;
  if (!("data" in record)) return json as T;

  const keys = Object.keys(record);
  const allowed = new Set(["data", "meta", "links", "message"]);
  if (keys.length > 0 && keys.every((key) => allowed.has(key))) {
    return record.data as T;
  }

  return json as T;
}

async function fetchMock<T>(
  path: string,
  init: ApiRequestInit | undefined,
  state: MockState,
): Promise<T> {
  const { record } = toQuery(init?.searchParams);
  const mockDelay = resolveMockDelay();

  if (state === "loading") return forever(init?.signal);

  if (state === "error") {
    await delay(Math.min(mockDelay, 300), init?.signal);
    throw new ApiError("تعذر جلب البيانات (حالة اختبار مجبرة).", {
      status: 500,
      path,
    });
  }

  await delay(state === "slow" ? MOCK_SLOW_DELAY : mockDelay, init?.signal);

  if (state === "empty") return emptyMock(path) as T;

  return resolveMock(path, record) as T;
}

async function readErrorBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/** Soft GET timeout so SSR cannot hang forever on an unreachable API. */
const GET_TIMEOUT_MS = 10_000;

function resolveFetchSignal(
  method: "GET" | "POST",
  signal?: AbortSignal,
): AbortSignal | undefined {
  if (method !== "GET") return signal;
  if (typeof AbortSignal.timeout !== "function") return signal;

  const timeout = AbortSignal.timeout(GET_TIMEOUT_MS);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, timeout]);
  }
  return signal;
}

async function fetchReal<T>(
  path: string,
  init?: ApiRequestInit,
  method: "GET" | "POST" = "GET",
  body?: unknown,
): Promise<T> {
  const { search } = toQuery(init?.searchParams);
  const base = resolveApiBaseUrl();
  if (!base) {
    throw new ApiError(
      "API_URL / NEXT_PUBLIC_API_URL is unset while mock mode is off. Set the API origin or enable MOCK_MODE=true.",
      { status: 500, path },
    );
  }
  const url = `${base}${path}${search}`;

  const headers = apiDefaultHeaders(init?.headers);
  if (
    body !== undefined &&
    !headers["Content-Type"] &&
    !headers["content-type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const signal = resolveFetchSignal(method, init?.signal);

  try {
    const response = await fetch(url, {
      method,
      signal,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      next: init?.next,
    });

    if (!response.ok) {
      if (init?.nullOn404 && response.status === 404) {
        return null as T;
      }
      throw new ApiError(`Request failed: ${response.status} ${path}`, {
        status: response.status,
        path,
        body: await readErrorBody(response),
      });
    }

    if (response.status === 204) {
      return null as T;
    }

    const json: unknown = await response.json();
    return unwrapPayload<T>(json);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        error.name === "DOMException")
    ) {
      throw new ApiError(`Request timed out: ${path}`, {
        status: 408,
        path,
      });
    }
    throw error;
  }
}

const PROXY_MOCK_STATE = "__mockState";
const PROXY_NULL_ON_404 = "__nullOn404";

/**
 * Browser → same-origin BFF so `MOCK_MODE` / `API_URL` resolve on the Node
 * server (runtime Docker env), not from build-time `NEXT_PUBLIC_*` inlining.
 */
async function fetchViaProxy<T>(
  path: string,
  init: ApiRequestInit | undefined,
  method: "GET" | "POST",
  body?: unknown,
): Promise<T> {
  if (!isAllowedProxyPath(path)) {
    throw new ApiError(`Proxy path not allowed: ${path}`, {
      status: 400,
      path,
    });
  }

  const url = new URL(`/api/proxy${path}`, window.location.origin);
  const { search } = toQuery(init?.searchParams);
  if (search) {
    const extra = new URLSearchParams(search.slice(1));
    extra.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  const browserMock = new URLSearchParams(window.location.search).get(
    MOCK_STATE_PARAM,
  );
  if (browserMock) url.searchParams.set(PROXY_MOCK_STATE, browserMock);
  if (init?.nullOn404) url.searchParams.set(PROXY_NULL_ON_404, "1");

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    signal: init?.signal,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status} ${path}`;
    let errBody: unknown;
    try {
      const json = (await response.json()) as {
        message?: string;
        body?: unknown;
      };
      if (json.message) message = json.message;
      errBody = json.body;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, {
      status: response.status,
      path,
      body: errBody,
    });
  }

  if (response.status === 204) return null as T;

  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

function resolveStateForCall(init?: ApiRequestInit): MockState {
  if (init?.mockState) return init.mockState;
  return currentMockState();
}

/**
 * Typed GET against the API, or against the fixtures while mocks are on.
 *
 * @param path - Path from `endpoints`, e.g. `endpoints.properties`.
 * @param init - Query parameters, abort signal and Next.js cache hints.
 *
 * @example
 * const list = await apiFetch<Property[]>(endpoints.properties, {
 *   searchParams: { featured: true, limit: 3 },
 * });
 */
export async function apiFetch<T>(
  path: string,
  init?: ApiRequestInit,
): Promise<T> {
  if (typeof window !== "undefined") {
    return fetchViaProxy<T>(path, init, "GET");
  }

  const state = resolveStateForCall(init);

  if (resolveMockMode()) return fetchMock<T>(path, init, state);

  if (state === "loading") return forever(init?.signal);
  if (state === "error") {
    throw new ApiError("تعذر جلب البيانات (حالة اختبار مجبرة).", {
      status: 500,
      path,
    });
  }

  return fetchReal<T>(path, init, "GET");
}

/**
 * Typed POST against the API. Mock branch returns `mockResult` after delay.
 *
 * @param path - Path from `endpoints`.
 * @param body - JSON body.
 * @param options - Optional mock result, signal, headers.
 */
export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<ApiRequestInit, "nullOn404"> & { mockResult?: TResponse },
): Promise<TResponse> {
  if (typeof window !== "undefined") {
    return fetchViaProxy<TResponse>(path, options, "POST", body);
  }

  const state = resolveStateForCall(options);
  const mockDelay = resolveMockDelay();

  if (resolveMockMode()) {
    if (state === "loading") return forever(options?.signal);
    if (state === "error") {
      await delay(Math.min(mockDelay, 300), options?.signal);
      throw new ApiError("تعذر إرسال البيانات (حالة اختبار مجبرة).", {
        status: 500,
        path,
      });
    }
    await delay(
      state === "slow" ? MOCK_SLOW_DELAY : mockDelay,
      options?.signal,
    );
    if (options?.mockResult !== undefined) return options.mockResult;
    return { ok: true } as TResponse;
  }

  if (state === "loading") return forever(options?.signal);
  if (state === "error") {
    throw new ApiError("تعذر إرسال البيانات (حالة اختبار مجبرة).", {
      status: 500,
      path,
    });
  }

  return fetchReal<TResponse>(path, options, "POST", body);
}

/** Internal query keys used by `/api/proxy` (not forwarded to the backend). */
export const proxyInternalParams = {
  mockState: PROXY_MOCK_STATE,
  nullOn404: PROXY_NULL_ON_404,
} as const;
