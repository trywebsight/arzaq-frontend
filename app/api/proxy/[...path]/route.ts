import { NextResponse, type NextRequest } from "next/server";

import {
  ApiError,
  apiFetch,
  apiPost,
  proxyInternalParams,
} from "@/lib/api/client";
import { parseMockState } from "@/lib/api/mock-state";
import { isAllowedProxyPath } from "@/lib/api/proxy-path";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

function apiPathFromParams(segments: string[]): string {
  return `/${segments.map(encodeURIComponent).join("/")}`;
}

function searchParamsRecord(
  req: NextRequest,
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    if (
      key === proxyInternalParams.mockState ||
      key === proxyInternalParams.nullOn404
    ) {
      return;
    }
    out[key] = value;
  });
  return out;
}

function errorResponse(error: unknown, path: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, body: error.body },
      { status: error.status },
    );
  }
  console.error("[api/proxy]", path, error);
  return NextResponse.json(
    { message: "Proxy request failed" },
    { status: 500 },
  );
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { path: segments } = await context.params;
  const path = apiPathFromParams(segments);

  if (!isAllowedProxyPath(path)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const mockState = parseMockState(
    req.nextUrl.searchParams.get(proxyInternalParams.mockState),
  );
  const nullOn404 =
    req.nextUrl.searchParams.get(proxyInternalParams.nullOn404) === "1";

  try {
    const data = await apiFetch<unknown>(path, {
      searchParams: searchParamsRecord(req),
      signal: req.signal,
      nullOn404,
      mockState,
    });
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, path);
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { path: segments } = await context.params;
  const path = apiPathFromParams(segments);

  if (!isAllowedProxyPath(path)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const mockState = parseMockState(
    req.nextUrl.searchParams.get(proxyInternalParams.mockState),
  );

  let body: unknown = undefined;
  try {
    body = await req.json();
  } catch {
    body = undefined;
  }

  try {
    const data = await apiPost<unknown>(path, body, {
      searchParams: searchParamsRecord(req),
      signal: req.signal,
      mockState,
    });
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, path);
  }
}
