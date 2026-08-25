"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";
import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useActiveSection } from "@/components/layout/use-active-section";
import { DURATION, EASE, Flip, gsap, matchMotion, useGSAP } from "@/lib/gsap";
import { NAV_ITEMS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Site header: floating pill over the inset hero on desktop; solid white
 * bar with circular menu toggle (right) + wordmark (left) on mobile.
 * Active nav item uses a GSAP Flip gray pill.
 *
 * @param demoMode - When true, Websight marks replace the PNG logos (`DEMO_MODE`).
 */
export function Navbar({ demoMode = false }: { demoMode?: boolean }) {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const activeKey = useActiveSection();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const navListRef = React.useRef<HTMLUListElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLAnchorElement>());

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      const pill = pillRef.current;
      const list = navListRef.current;
      if (!pill || !list || !activeKey) {
        if (pill) gsap.set(pill, { autoAlpha: 0 });
        return;
      }

      const activeEl = itemRefs.current.get(activeKey);
      if (!activeEl) {
        gsap.set(pill, { autoAlpha: 0 });
        return;
      }

      const listRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      const rtl = getComputedStyle(list).direction === "rtl";
      const inlineStart = rtl
        ? listRect.right - itemRect.right
        : itemRect.left - listRect.left;

      return matchMotion({
        motion: () => {
          const state = Flip.getState(pill);
          gsap.set(pill, {
            autoAlpha: 1,
            width: itemRect.width,
            height: itemRect.height,
            top: itemRect.top - listRect.top,
            insetInlineStart: inlineStart,
            insetInlineEnd: "auto",
          });
          Flip.from(state, {
            duration: DURATION.fast,
            ease: EASE.inOut,
            absolute: false,
          });
        },
        reduced: () => {
          gsap.set(pill, {
            autoAlpha: 1,
            width: itemRect.width,
            height: itemRect.height,
            top: itemRect.top - listRect.top,
            insetInlineStart: inlineStart,
            insetInlineEnd: "auto",
          });
        },
      });
    },
    { dependencies: [activeKey, scrolled] },
  );

  const closeMenu = React.useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-3 focus:ring-ring/50 focus:ring-offset-2"
      >
        {tCommon("skipToContent")}
      </a>

      {/* Desktop floating pill — inside the hero white frame */}
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 z-40 hidden md:block",
          "top-[calc(var(--hero-frame-md)+1.25rem)] px-[calc(var(--hero-frame-md)+1.25rem)]",
          "xl:top-[calc(var(--hero-frame-xl)+1.5rem)] xl:px-[calc(var(--hero-frame-xl)+1.5rem)]",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto mx-auto flex max-w-5xl items-center gap-3 rounded-full px-3.5 py-3 transition-[background-color,box-shadow,backdrop-filter] duration-300",
            scrolled
              ? "bg-white/95 shadow-md backdrop-blur-md"
              : "bg-white/95 shadow-sm backdrop-blur-sm",
          )}
        >
          <HapticLink
            href="/"
            aria-label={t("logoAlt")}
            className="relative ms-1.5 shrink-0"
          >
            <SiteLogo
              variant="stacked"
              demo={demoMode}
              alt={t("logoAlt")}
              className="h-12 w-auto"
              sizes="48px"
            />
          </HapticLink>

          <nav
            aria-label={t("label")}
            className="flex min-w-0 flex-1 justify-center"
          >
            <ul ref={navListRef} className="relative flex items-center gap-1">
              <span
                ref={pillRef}
                aria-hidden
                className="pointer-events-none absolute inset-s-0 top-0 rounded-full bg-secondary opacity-0"
              />
              {NAV_ITEMS.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <li key={item.key} className="relative z-10">
                    <HapticLink
                      href={item.href}
                      ref={(node) => {
                        if (node) itemRefs.current.set(item.key, node);
                        else itemRefs.current.delete(item.key);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-2.5 text-[0.9375rem]/normal font-medium transition-colors",
                        isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {t(`items.${item.key}`)}
                    </HapticLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button
            variant="primary"
            size="pill"
            asChild
            haptics={false}
            className="me-1.5 h-12 px-7 text-[0.9375rem]"
          >
            <HapticLink href="/contact">{t("cta")}</HapticLink>
          </Button>
        </div>
      </header>

      {/*
 Mobile header — solid white bar.
 DOM order menu → logo so RTL flex + justify-between places the
 hamburger at inline-start (right) and the logo at inline-end (left).
 */}
      <header className="fixed inset-x-0 top-0 z-40 bg-white md:hidden">
        <div className="flex h-(--nav-bar-h) items-center justify-between px-5">
          <Button
            ref={menuButtonRef}
            type="button"
            variant="outline"
            size="icon-pill"
            aria-label={tCommon("openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(true)}
            className="size-10 border-border bg-white shadow-none hover:bg-muted/40"
          >
            <Menu className="size-4.5 text-ink" strokeWidth={1.5} aria-hidden />
          </Button>

          <HapticLink
            href="/"
            aria-label={t("logoAlt")}
            className="relative shrink-0"
          >
            <SiteLogo
              variant="wordmark"
              demo={demoMode}
              alt={t("logoAlt")}
              className="h-7 w-auto"
              sizes="120px"
              priority
            />
          </HapticLink>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={closeMenu}
        returnFocusRef={menuButtonRef}
        activeKey={activeKey}
      />
    </>
  );
}
