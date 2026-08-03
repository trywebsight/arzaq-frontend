import type { ImageAsset } from "@/lib/assets";

/**
 * Whether an asset can be passed to `next/image` without throwing.
 *
 * @param asset - API or mock image; null/undefined/empty src are unsafe.
 */
export function hasImageSrc(
  asset: ImageAsset | null | undefined,
): asset is ImageAsset {
  return Boolean(asset?.src);
}
