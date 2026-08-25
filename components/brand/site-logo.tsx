import {
  WebsightMark,
  WebsightWordmark,
} from "@/components/brand/websight-logo";
import { SmartImage } from "@/components/common/smart-image";
import { assets } from "@/lib/assets";

export type SiteLogoVariant = "stacked" | "wordmark";

export type SiteLogoProps = {
  /** `stacked` is the square mark; `wordmark` is the wide lockup. */
  variant: SiteLogoVariant;
  /**
   * When true, render the Websight SVG marks instead of the PNG lockups.
   * Driven by `DEMO_MODE` / `NEXT_PUBLIC_DEMO_MODE`.
   */
  demo?: boolean;
  /** Arabic alternative text. Ignored for decorative demo SVGs (parent names them). */
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Brand mark used in the header and footer.
 *
 * @param variant - `stacked` is the square mark; `wordmark` is the wide lockup.
 * @param demo - Swap in Websight marks when `DEMO_MODE` is on.
 * @example
 * <SiteLogo variant="stacked" alt={t("logoAlt")} className="h-12 w-auto" sizes="48px" />
 */
export function SiteLogo({
  variant,
  demo = false,
  alt,
  className,
  sizes,
  priority,
}: SiteLogoProps) {
  if (demo) {
    const DemoLogo = variant === "wordmark" ? WebsightWordmark : WebsightMark;
    return <DemoLogo className={className} />;
  }

  const asset =
    variant === "wordmark" ? assets.logoWordmark : assets.logoStacked;

  return (
    <SmartImage
      {...asset}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
