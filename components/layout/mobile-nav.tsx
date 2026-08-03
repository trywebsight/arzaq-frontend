"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  Home,
  Info,
  Users,
  X,
} from "lucide-react";

import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import { DURATION, EASE, gsap, matchMotion, useGSAP } from "@/lib/gsap";
import { NAV_ITEMS, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<
  NavItem["key"],
  React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
    strokeWidth?: number;
  }>
> = {
  home: Home,
  about: Info,
  properties: Building2,
  services: Briefcase,
  team: Users,
  blog: FileText,
};

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

export type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  /** Element that opened the drawer — focus returns here on close. */
  returnFocusRef: React.RefObject<HTMLElement | null>;
  /** Currently active nav key, for the highlighted row. */
  activeKey: NavItem["key"] | null;
};

/**
 * Full-screen mobile navigation drawer.
 *
 * Focus trap, Escape-to-close, body scroll lock, and GSAP open/close with a
 * reduced-motion instant branch.
 */
export function MobileNav({
  open,
  onClose,
  returnFocusRef,
  activeKey,
}: MobileNavProps) {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );
  const [rendered, setRendered] = React.useState(open);

  if (open && !rendered) {
    setRendered(true);
  }

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || !rendered) return;

      return matchMotion({
        motion: () => {
          if (open) {
            gsap.fromTo(
              panel,
              { autoAlpha: 0, y: 16 },
              {
                autoAlpha: 1,
                y: 0,
                duration: DURATION.fast,
                ease: EASE.out,
              },
            );
          } else {
            gsap.to(panel, {
              autoAlpha: 0,
              y: 12,
              duration: DURATION.fast,
              ease: EASE.soft,
              onComplete: () => setRendered(false),
            });
          }
        },
        reduced: () => {
          gsap.set(panel, { autoAlpha: open ? 1 : 0, y: 0 });
          if (!open) setRendered(false);
        },
      });
    },
    { dependencies: [open, rendered] },
  );

  React.useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () => {
      if (!panel) return [] as HTMLElement[];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
    };

    const focusables = getFocusable();
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, returnFocusRef]);

  if (!mounted || !rendered) return null;

  return createPortal(
    <div
      ref={panelRef}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label={tCommon("menu")}
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        "bg-[linear-gradient(180deg,#ffffff_0%,#eaf8fe_100%)]",
        "px-5 pb-8 pt-5",
      )}
    >
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-pill-sm"
          aria-label={tCommon("closeMenu")}
          onClick={onClose}
          className="text-ink"
        >
          <X className="size-5" aria-hidden />
        </Button>
      </div>

      <nav
        aria-label={t("label")}
        className="mt-6 flex flex-1 flex-col gap-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.key];
          const isActive = activeKey === item.key;

          return (
            <HapticLink
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl py-3 pe-3 transition-colors",
                isActive ? "ps-4" : "ps-3",
                isActive
                  ? "bg-accent text-ink"
                  : "text-ink-muted hover:bg-white/70",
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-y-5 inset-s-0 w-1 rounded-s-full bg-primary"
                />
              ) : null}
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-ink-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-base font-medium">
                {t(`items.${item.key}`)}
              </span>
            </HapticLink>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-border pt-5">
        <Button
          variant="primary"
          size="pill"
          className="w-full"
          asChild
          haptics={false}
        >
          <HapticLink href="/contact" onClick={onClose}>
            {t("cta")}
            <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </HapticLink>
        </Button>
      </div>
    </div>,
    document.body,
  );
}
