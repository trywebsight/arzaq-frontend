import { connection } from "next/server";

import {
  CtaVisibilityProvider,
  CtaBandGate,
} from "@/components/layout/cta-visibility";
import { CtaBand } from "@/components/layout/cta-band";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

export type SiteShellProps = {
  children: React.ReactNode;
  /**
   * Whether the CTA band is shown by default.
   * Pages can still mount `<OptOutCta />` to hide it per-route.
   * Nested layouts can pass `false` to start hidden.
   * @default true
   */
  showCta?: boolean;
};

/**
 * App chrome: Navbar, page content, optional CTA band, Footer.
 *
 * Non-home routes get `--page-pad-top` (nav bar + modest breath) so content
 * clears the fixed floating nav. Home keeps a flush main when `#hero` is
 * present (`has-[#hero]:pt-0`, full-bleed under nav).
 *
 * @example
 * // app/layout.tsx
 * <SiteShell>{children}</SiteShell>
 *
 * // app/privacy/page.tsx — hide the band
 * <>
 *   <OptOutCta />
 *   <main>…</main>
 * </>
 */
export async function SiteShell({ children, showCta = true }: SiteShellProps) {
  await connection();
  const demoMode = true;

  return (
    <CtaVisibilityProvider defaultVisible={showCta}>
      <ScrollToTop />
      <Navbar demoMode={demoMode} />
      <div className="flex min-h-0 flex-1 flex-col pt-(--page-pad-top) has-[#hero]:pt-0">
        {children}
      </div>
      <CtaBandGate>
        <CtaBand />
      </CtaBandGate>
      <Footer demoMode={demoMode} />
    </CtaVisibilityProvider>
  );
}
