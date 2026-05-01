import type { ReactNode } from 'react';

import '@/shared/styles/landing.css';

import { MarketingShell } from './_components/MarketingShell';

type MarketingLayoutProps = {
  children: ReactNode;
};

/**
 * Marketing route-group layout.
 * Wraps public marketing routes without adding a URL segment.
 */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="marketing-root" data-surface="marketing">
      <MarketingShell>{children}</MarketingShell>
    </div>
  );
}
