import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeaturePointProps = {
  /** Lucide icon rendered in white on the brand square. */
  icon: LucideIcon;
  /** Localised supporting copy under the icon. */
  description: string;
  className?: string;
};

/**
 * Centered icon + description column used on the Services sellers/buyers bands.
 *
 * @param icon - Lucide icon component.
 * @param description - Localised body copy.
 *
 * @example
 * <FeaturePoint icon={Target} description={t("goals")} />
 */
export function FeaturePoint({
  icon: Icon,
  description,
  className,
}: FeaturePointProps) {
  return (
    <div
      data-card
      className={cn(
        "flex flex-col items-center gap-4 text-center md:gap-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-lg bg-primary text-white md:size-14"
      >
        <Icon className="size-6 md:size-7" strokeWidth={1.75} />
      </span>
      <p className="max-w-xs text-sm/relaxed text-pretty text-ink-muted md:text-base ">
        {description}
      </p>
    </div>
  );
}
