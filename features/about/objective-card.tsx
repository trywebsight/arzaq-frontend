import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ObjectiveCardProps = {
  /** Lucide icon rendered in white on the brand square. */
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

/**
 * Light-gray objective card: brand icon tile, title and short description.
 *
 * @param icon - Lucide icon component.
 * @param title - Localised objective title.
 * @param description - Localised supporting copy.
 *
 * @example
 * <ObjectiveCard icon={ClipboardCheck} title={t("title")} description={t("description")} />
 */
export function ObjectiveCard({
  icon: Icon,
  title,
  description,
  className,
}: ObjectiveCardProps) {
  return (
    <article
      data-card
      className={cn(
        "flex h-full flex-col gap-5 rounded-card bg-muted p-6 md:gap-6 md:p-8 xl:p-9",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-12 items-center justify-center rounded-lg bg-primary text-white md:size-14"
      >
        <Icon className="size-6 md:size-7" strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-col gap-2.5 md:gap-3">
        <h3 className="text-lg font-bold text-balance text-ink md:text-xl xl:text-2xl">
          {title}
        </h3>
        <p className="text-sm/relaxed text-pretty text-ink-muted md:text-base ">
          {description}
        </p>
      </div>
    </article>
  );
}
