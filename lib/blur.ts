import blurMap from "@/lib/generated/blur-map.json";

/**
 * Tiny neutral shimmer used when no per-image LQIP exists (remote CMS
 * images without `blurDataURL`, or unknown paths). Works with
 * `placeholder="blur"` on `next/image`.
 */
export const SHIMMER_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#e8e8e8" offset="0%"/>
          <stop stop-color="#f5f5f5" offset="50%"/>
          <stop stop-color="#e8e8e8" offset="100%"/>
        </linearGradient>
      </defs>
      <rect width="16" height="10" fill="url(#g)"/>
    </svg>`,
  );

const staticBlurMap = blurMap as Record<string, string>;

/**
 * Resolve a blur placeholder for `next/image`.
 *
 * Priority: explicit asset/API `blurDataURL` → static public map → shimmer.
 * Remote absolute URLs without a provided blur use the shimmer so
 * `placeholder="blur"` still works (Next requires blurDataURL for non-static imports).
 *
 * @param src - Image `src` (public path or absolute URL).
 * @param explicit - Optional LQIP from CMS / `ImageAsset.blurDataURL`.
 */
export function resolveBlurDataURL(
  src: string | undefined | null,
  explicit?: string | null,
): string {
  if (explicit && explicit.length > 0) return explicit;
  if (src && staticBlurMap[src]) return staticBlurMap[src];
  return SHIMMER_BLUR_DATA_URL;
}

/** True when `src` is an absolute http(s) URL (CMS / CDN). */
export function isRemoteImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}
