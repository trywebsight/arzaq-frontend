import {
  WEBSIGHT_MARK_PATHS,
  WEBSIGHT_MARK_VIEWBOX,
  WEBSIGHT_WORDMARK_PATHS,
  WEBSIGHT_WORDMARK_VIEWBOX,
} from "@/lib/brand/websight";
import { cn } from "@/lib/utils";

type WebsightSvgProps = {
  className?: string;
};

function WebsightSvg({
  viewBox,
  paths,
  className,
}: {
  viewBox: { width: number; height: number };
  paths: readonly string[];
  className?: string;
}) {
  return (
    <svg
      width={viewBox.width}
      height={viewBox.height}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      className={cn("block text-ink", className)}
    >
      {paths.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * Compact Websight W-mark. Fills `currentColor` (defaults to ink).
 *
 * @example
 * <WebsightMark className="h-12 w-auto" />
 */
export function WebsightMark({ className }: WebsightSvgProps) {
  return (
    <WebsightSvg
      viewBox={WEBSIGHT_MARK_VIEWBOX}
      paths={WEBSIGHT_MARK_PATHS}
      className={className}
    />
  );
}

/**
 * Horizontal Websight wordmark. Fills `currentColor` (defaults to ink)
 * so the lockup stays visible on the light header — the source asset is white.
 *
 * @example
 * <WebsightWordmark className="h-7 w-auto" />
 */
export function WebsightWordmark({ className }: WebsightSvgProps) {
  return (
    <WebsightSvg
      viewBox={WEBSIGHT_WORDMARK_VIEWBOX}
      paths={WEBSIGHT_WORDMARK_PATHS}
      className={className}
    />
  );
}
