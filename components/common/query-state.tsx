"use client";

import * as React from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Structural subset of `UseQueryResult`, so a `useQuery(...)` result can be
 * passed straight through without adapters.
 */
export type QueryLike<TData> = {
  data: TData | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  isStale?: boolean;
  refetch: () => unknown;
};

export type QueryStateProps<TData> = {
  query: QueryLike<TData>;
  /** Rendered with non-empty data. */
  children: (data: TData) => React.ReactNode;
  /**
   * Loading UI. Pass a `<BoneSkeleton>` fallback or a hand-written placeholder
   * — never a bare spinner for content that has a known shape.
   */
  skeleton: React.ReactNode;
  /**
   * Emptiness test. Defaults to "array with no items", which covers every
   * list query in the app.
   */
  isEmpty?: (data: TData) => boolean;
  /** Replaces the default error block. */
  errorFallback?: React.ReactNode;
  /** Replaces the default empty block. */
  emptyFallback?: React.ReactNode;
  /** Override the default empty copy from the `Common` namespace. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Override the default error copy from the `Common` namespace. */
  errorTitle?: string;
  errorDescription?: string;
  /**
   * Dim the content and announce a refresh while a background refetch runs.
   * @default true
   */
  showRefetching?: boolean;
  className?: string;
};

function defaultIsEmpty(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  return data === null || data === undefined;
}

/**
 * Renders the five query states consistently across every section:
 * loading, error + retry, empty, background refetch and success.
 *
 * @example
 * const query = useFeaturedProperties();
 *
 * <QueryState query={query} skeleton={<PropertyGridSkeleton />}>
 *   {(properties) => (
 *     <StaggerGroup className="grid gap-6 md:grid-cols-3">
 *       {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
 *     </StaggerGroup>
 *   )}
 * </QueryState>
 */
export function QueryState<TData>({
  query,
  children,
  skeleton,
  isEmpty = defaultIsEmpty as (data: TData) => boolean,
  errorFallback,
  emptyFallback,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  showRefetching = true,
  className,
}: QueryStateProps<TData>) {
  const t = useTranslations("Common");

  if (query.isPending) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        <span className="sr-only">{t("loading")}</span>
        {skeleton}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className={className}>
        {errorFallback ?? (
          <QueryErrorState
            title={errorTitle}
            description={errorDescription}
            onRetry={() => query.refetch()}
          />
        )}
      </div>
    );
  }

  const data = query.data as TData;

  if (isEmpty(data)) {
    return (
      <div className={className}>
        {emptyFallback ?? (
          <QueryEmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    );
  }

  const refetching = showRefetching && query.isFetching;

  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        refetching && "opacity-70",
        className,
      )}
      data-refetching={refetching || undefined}
      data-stale={query.isStale || undefined}
    >
      {refetching ? (
        <span className="sr-only" role="status">
          {t("refreshing")}
        </span>
      ) : null}
      {children(data)}
    </div>
  );
}

export type QueryErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

/** Error panel with a retry action. Copy defaults to the `Common` namespace. */
export function QueryErrorState({
  title,
  description,
  onRetry,
  className,
}: QueryErrorStateProps) {
  const t = useTranslations("Common");

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-border bg-muted/50 px-6 py-12 text-center",
        className,
      )}
    >
      <TriangleAlert className="size-6 text-ink-muted" aria-hidden="true" />
      <p className="text-lg font-semibold text-ink">
        {title ?? t("error.title")}
      </p>
      <p className="max-w-md text-sm text-ink-muted">
        {description ?? t("error.description")}
      </p>
      {onRetry ? (
        <Button
          variant="outline"
          size="pill-sm"
          onClick={onRetry}
          className="mt-2 text-black"
        >
          <RotateCcw aria-hidden="true" />
          {t("error.retry")}
        </Button>
      ) : null}
    </div>
  );
}

export type QueryEmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/** Empty panel. Copy defaults to the `Common` namespace. */
export function QueryEmptyState({
  title,
  description,
  action,
  className,
}: QueryEmptyStateProps) {
  const t = useTranslations("Common");

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <p className="text-lg font-semibold text-ink">
        {title ?? t("empty.title")}
      </p>
      <p className="max-w-md text-sm text-ink-muted">
        {description ?? t("empty.description")}
      </p>
      {action}
    </div>
  );
}
