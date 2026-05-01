import type { ReactNode } from 'react';

import { marketingShellPlugins } from './MarketingShellPlugins';

type MarketingShellProps = {
  readonly children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  const Shell = marketingShellPlugins;

  return (
    <div className="marketing-shell">
      <Shell.IntroScene />

      <div className="marketing-shell__chrome">
        <a className="marketing-shell__skip-link" href="#marketing-main">
          Skip to content
        </a>

        <Shell.ExplorerProvider>
          <Shell.TruthInstrumentProvider>
            <Shell.Navigation />
            <Shell.NavigationPanel />
            <Shell.ExplorerDialog />
            <main id="marketing-main" className="marketing-shell__main">
              {children}
            </main>
          </Shell.TruthInstrumentProvider>
        </Shell.ExplorerProvider>

        <Shell.Footer />
      </div>
    </div>
  );
}
