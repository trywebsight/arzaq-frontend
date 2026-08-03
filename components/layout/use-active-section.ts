"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { NAV_ITEMS, type NavItem } from "@/lib/site";

/**
 * Home in-page sections that drive the floating nav pill.
 * Order matches document order / `NAV_ITEMS`. Page-route `href`s (e.g.
 * `/about`, `/blog`) do not disable observation on `/` — only `sectionId`
 * matters while the user is on the home page.
 */
const HOME_SCROLL_ITEMS = NAV_ITEMS.filter(
  (item): item is NavItem & { sectionId: string } => Boolean(item.sectionId),
);

function pathNavKey(pathname: string): NavItem["key"] | null {
  const match = NAV_ITEMS.find(
    (item) =>
      item.href.startsWith("/") &&
      item.href !== "/" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return match?.key ?? null;
}

/**
 * Resolve the active nav key from scroll position against home section
 * anchors. Uses viewport-relative tops so sticky chrome / transforms do not
 * skew `scrollY` maths.
 */
function sectionKeyFromScroll(): NavItem["key"] {
  const marker = window.innerHeight * 0.35;
  let current: NavItem["key"] = "home";

  for (const item of HOME_SCROLL_ITEMS) {
    const el = document.getElementById(item.sectionId);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= marker) {
      current = item.key;
    }
  }

  return current;
}

/**
 * Tracks which primary-nav item is active.
 *
 * On `/`, observes every `NAV_ITEMS[].sectionId` that exists in the DOM
 * (hero, about, properties, services, team, blog — and any future home
 * anchors). Page hrefs like `/about` or `/blog` only win off the home page;
 * they do not suppress home hash observation.
 *
 * On other routes, matches `NAV_ITEMS` page hrefs (e.g. `/about`, `/properties`).
 */
export function useActiveSection(): NavItem["key"] | null {
  const pathname = usePathname();
  const [scrollKey, setScrollKey] = React.useState<NavItem["key"]>("home");
  const routeKey = pathNavKey(pathname);

  React.useEffect(() => {
    if (pathname !== "/") return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollKey(sectionKeyFromScroll());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Sections may mount after paint (client query shells); re-check once
    // the home tree settles so a late `#blog` / `#properties` still binds.
    const settle = window.setTimeout(update, 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname !== "/") return routeKey;
  return scrollKey;
}
