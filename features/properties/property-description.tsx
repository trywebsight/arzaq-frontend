"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PropertyDescriptionProps = {
  /** Full Arabic description / excerpt. */
  text: string;
  className?: string;
  /**
   * Tailwind line-clamp utility applied while collapsed.
   * @default "line-clamp-5"
   */
  clampClassName?: string;
};

/**
 * Collapsible property description. Long copy is clamped with CSS
 * `line-clamp` (safe for Arabic joining); a control expands or collapses it.
 * The toggle is omitted when the text fits within the clamp.
 *
 * @param text - Full description string from the property payload.
 * @example
 * <PropertyDescription text={property.excerpt} />
 */
export function PropertyDescription({
  text,
  className,
  clampClassName = "line-clamp-5",
}: PropertyDescriptionProps) {
  const t = useTranslations("Common");
  const [expanded, setExpanded] = React.useState(false);
  const [overflows, setOverflows] = React.useState(false);
  const [prevText, setPrevText] = React.useState(text);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const descriptionId = React.useId();

  if (text !== prevText) {
    setPrevText(text);
    setExpanded(false);
  }

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let cancelled = false;

    /**
     * Measure only while collapsed (clamp applied). `line-clamp` +
     * `overflow: hidden` routinely reports scrollHeight a couple of pixels
     * above clientHeight even when copy fits (descenders / half-leading), so
     * compare with a line-height-based epsilon — not a bare `+ 1`.
     */
    const update = () => {
      if (cancelled || expanded) return;

      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
      const epsilon = Number.isFinite(lineHeight)
        ? Math.max(2, lineHeight * 0.1)
        : 2;

      setOverflows(el.scrollHeight > el.clientHeight + epsilon);
    };

    update();

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        if (!cancelled) update();
      });
    }

    window.addEventListener("resize", update);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(el);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [text, expanded, clampClassName]);

  return (
    <div className={cn(className)}>
      <p
        ref={textRef}
        id={descriptionId}
        className={cn(
          "text-base/relaxed text-pretty text-ink-muted md:text-lg ",
          !expanded && clampClassName,
        )}
      >
        {text}
      </p>
      {overflows ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-2 h-auto px-0 text-sm font-semibold"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? t("readLess") : t("readMore")}
        </Button>
      ) : null}
    </div>
  );
}
