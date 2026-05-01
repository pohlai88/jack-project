import type { ReactNode } from 'react';

import { MarketingPanel, MarketingPanelHeader, MarketingSection } from './landing-primitives';

type InlineExplorerSectionProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export function InlineExplorerSection({ id, label, children }: InlineExplorerSectionProps) {
  return (
    <MarketingSection id={`mkt-inline-${id}`} aria-labelledby={`mkt-inline-${id}-title`}>
      <div className="marketing-inline-explorer">
        <MarketingPanel>
          <MarketingPanelHeader>
            <div>
              <p className="marketing-eyebrow">Inline deep dive</p>
              <h2 id={`mkt-inline-${id}-title`} className="marketing-h1">
                {label}
              </h2>
            </div>
            <span className="marketing-mono">long page block</span>
          </MarketingPanelHeader>
          {children}
        </MarketingPanel>
      </div>
    </MarketingSection>
  );
}
