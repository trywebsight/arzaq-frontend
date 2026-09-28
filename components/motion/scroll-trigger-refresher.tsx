"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { ScrollTrigger } from "@/lib/gsap";

/** Quiet period before re-measuring, so a burst of layout changes costs one refresh. */
const REFRESH_DELAY_MS = 150;

/**
 * Keeps ScrollTrigger start positions in sync with the page.
 *
 * ScrollTrigger measures once, but the layout (Navbar, CtaBand, Footer) stays
 * mounted across client navigations, and listing data / images change page
 * height after mount. Without a refresh, a trigger measured on a long page can
 * sit below the bottom of a shorter one and never fire. Mounted once in
 * `Providers`; renders nothing.
 */
export function ScrollTriggerRefresher() {
  const pathname = usePathname();

  React.useEffect(() => {
    let timer: number | undefined;
    const scheduleRefresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DELAY_MS);
    };

    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(document.body);
    scheduleRefresh();

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
