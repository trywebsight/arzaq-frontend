import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusScreenProps = {
  /** Large status code, e.g. `404` or `500`. */
  code: string;
  title: string;
  description: string;
  /** One or more CTA buttons. */
  actions: ReactNode;
  className?: string;
};

/**
 * Branded empty / error status layout for `not-found`, `error`, and
 * `global-error`. Keeps digests and stack traces out of the UI.
 *
 * @example
 * <StatusScreen
 *   code={t("code")}
 *   title={t("title")}
 *   description={t("description")}
 *   actions={<Button>...</Button>}
 * />
 */
export function StatusScreen({
  code,
  title,
  description,
  actions,
  className,
}: StatusScreenProps) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={cn(
        "flex flex-1 flex-col items-center justify-center bg-background px-5 py-24 text-center md:px-8 md:py-32",
        className,
      )}
    >
      <p className="text-7xl/none font-bold tracking-tight text-ink md:text-8xl xl:text-9xl ">
        {code}
      </p>
      <h1 className="mt-6 text-2xl font-bold text-balance text-ink md:mt-8 md:text-3xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md whitespace-pre-line text-base/relaxed text-pretty text-ink-muted md:mt-5 md:text-lg ">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
        {actions}
      </div>
    </main>
  );
}
