import * as React from "react";
import Image, { type ImageProps } from "next/image";

import { resolveBlurDataURL } from "@/lib/blur";
import { cn } from "@/lib/utils";

export type SmartImageProps = Omit<
  ImageProps,
  "placeholder" | "blurDataURL"
> & {
  /**
   * Optional LQIP. Prefer CMS `ImageAsset.blurDataURL` for remote media.
   * Local `/public` paths resolve from the build-time blur map automatically.
   */
  blurDataURL?: string | null;
};

/**
 * `next/image` with always-on blur-up placeholders (local + remote).
 *
 * Remote images without a CMS blur still get a shimmer LQIP so the
 * progressive reveal works the same way as static assets.
 *
 * @example
 * <SmartImage src={asset.src} alt={asset.alt} fill sizes="100vw" priority />
 * <SmartImage {...asset} blurDataURL={asset.blurDataURL} sizes="33vw" />
 */
export function SmartImage({
  blurDataURL,
  src,
  alt,
  quality = 75,
  className,
  ...props
}: SmartImageProps) {
  const srcKey = typeof src === "string" ? src : undefined;
  const blur = resolveBlurDataURL(srcKey, blurDataURL);

  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={blur}
      quality={quality}
      className={cn(className)}
      {...props}
    />
  );
}
