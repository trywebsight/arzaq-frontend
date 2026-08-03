"use client";

import * as React from "react";

type CtaVisibilityContextValue = {
  /** Whether the layout CTA band should render. */
  visible: boolean;
  /** Hide the CTA band for the current route. */
  hide: () => void;
  /** Show the CTA band again (used on unmount of `OptOutCta`). */
  show: () => void;
};

const CtaVisibilityContext = React.createContext<CtaVisibilityContextValue | null>(
  null,
);

export type CtaVisibilityProviderProps = {
  children: React.ReactNode;
  /** Initial visibility. Nested layouts can pass `false`. @default true */
  defaultVisible?: boolean;
};

/**
 * Owns the layout-level CTA band visibility flag.
 *
 * Pages that should not show the band mount `<OptOutCta />` as a child.
 */
export function CtaVisibilityProvider({
  children,
  defaultVisible = true,
}: CtaVisibilityProviderProps) {
  const [visible, setVisible] = React.useState(defaultVisible);

  const hide = React.useCallback(() => setVisible(false), []);
  const show = React.useCallback(() => setVisible(true), []);

  const value = React.useMemo<CtaVisibilityContextValue>(
    () => ({ visible, hide, show }),
    [visible, hide, show],
  );

  return (
    <CtaVisibilityContext.Provider value={value}>
      {children}
    </CtaVisibilityContext.Provider>
  );
}

function useCtaVisibility() {
  const ctx = React.useContext(CtaVisibilityContext);
  if (!ctx) {
    throw new Error(
      "CtaVisibility hooks must be used within CtaVisibilityProvider",
    );
  }
  return ctx;
}

/**
 * Mount inside a page to hide the layout CTA band for that route.
 *
 * Restores visibility when the page unmounts (client navigation away).
 *
 * @example
 * export default function PrivacyPage() {
 *   return (
 *     <>
 *       <OptOutCta />
 *       <main>…</main>
 *     </>
 *   );
 * }
 */
export function OptOutCta() {
  const { hide, show } = useCtaVisibility();

  React.useEffect(() => {
    hide();
    return () => show();
  }, [hide, show]);

  return null;
}

/**
 * Renders `children` only when the CTA band is visible.
 *
 * Pass the server-rendered `<CtaBand />` as children so it stays an RSC.
 */
export function CtaBandGate({ children }: { children: React.ReactNode }) {
  const { visible } = useCtaVisibility();
  if (!visible) return null;
  return children;
}
