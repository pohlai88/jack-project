import type { ReactNode } from 'react';

import '../../../shared/styles/landing.css';

import { MarketingExplorerDialog } from './_components/MarketingExplorerDialog';
import { MarketingExplorerProvider } from './_components/MarketingExplorerProvider';
import { MarketingNav } from './_components/MarketingNav';
import { MarketingTruthInstrumentProvider } from './_components/MarketingTruthInstrumentProvider';
import { MarketingTruthLadder } from './_components/MarketingTruthLadder';
import { MarketingFooter } from './_sections/MarketingFooter';

type MarketingLayoutProps = {
  children: ReactNode;
};

/**
 * Marketing route group layout — orchestrates the persistent shell for all
 * marketing pages (nav, footer, explorer modal, providers).
 *
 * Route group `(marketing)` means NO URL segment — this layout wraps pages at
 * `/{locale}/`, `/{locale}/pricing`, etc. without adding `/marketing` to URLs.
 *
 * Responsibilities: shared landing stylesheet, persistent marketing nav,
 * explorer provider/dialog, footer, and the `.marketing-root` cascade scope.
 */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MarketingExplorerProvider>
      <MarketingTruthInstrumentProvider>
        <div className="marketing-root">
          <MarketingNav />
          <MarketingTruthLadder />
          <MarketingExplorerDialog />
          <main>{children}</main>
          <MarketingFooter />
        </div>
      </MarketingTruthInstrumentProvider>
    </MarketingExplorerProvider>
  );
}
