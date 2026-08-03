"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Resets window scroll on App Router pathname changes.
 *
 * The root layout / `SiteShell` stay mounted across soft navigations, so the
 * browser can leave the previous scroll position in place. Hash-only updates
 * on the same route are ignored so in-page anchors (`#properties`, etc.) still
 * work. Navigations that include a hash skip the reset so the target section
 * can receive focus/scroll.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  React.useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  React.useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
