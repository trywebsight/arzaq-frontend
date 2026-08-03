"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptic";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm/normal font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        /** Brand blue fill. The page's main call to action. */
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/95",
        /** Dark ink fill, for use on light photography and white cards. */
        ink: "bg-ink text-white hover:bg-ink/90",
        /** White fill, for use on the blue band and over photography. */
        white:
          "bg-white text-ink shadow-xs hover:bg-white/90 active:bg-white/95",
        /** Transparent with an ink hairline. */
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        /** Transparent with a white hairline, for use over photography. */
        "outline-white":
          "border-white/60 bg-transparent text-white hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        /** Marketing pill, the default shape across the landing page. */
        pill: "h-11 gap-2 rounded-full px-6 text-sm [&_svg:not([class*='size-'])]:size-4",
        "pill-sm": "h-9 gap-1.5 rounded-full px-4 text-[0.8rem]",
        "pill-lg":
          "h-13 gap-2.5 rounded-full px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        /** Circular icon action — phone, WhatsApp, carousel arrows. */
        "icon-pill": "size-11 rounded-full",
        "icon-pill-sm": "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a `<button>`. */
    asChild?: boolean;
    /**
     * Haptic feedback on press. `true` uses the default 50ms pulse, a number
     * or pattern is forwarded to `haptic()`, `false` opts out.
     * @default true
     */
    haptics?: boolean | number | number[];
  };

/**
 * The single button primitive for the app.
 *
 * Fires haptic feedback on every press by default — do not wire `haptic()`
 * manually on top of this.
 *
 * @example
 * <Button variant="primary" size="pill">{t("cta")}</Button>
 * <Button variant="white" size="icon-pill" aria-label={t("callUs")}><Phone /></Button>
 */
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  haptics = true,
  onClick,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (haptics !== false) {
        haptic(typeof haptics === "boolean" ? undefined : haptics);
      }
      onClick?.(event);
    },
    [haptics, onClick],
  );

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  );
}

export { Button, buttonVariants };
