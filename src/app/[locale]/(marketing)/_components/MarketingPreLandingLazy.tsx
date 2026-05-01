'use client';

import dynamic from 'next/dynamic';

const MarketingPreLandingDynamic = dynamic(
  () =>
    import('./MarketingPreLanding').then((m) => ({
      default: m.MarketingPreLanding,
    })),
  { ssr: false },
);

export function MarketingPreLandingLazy() {
  return <MarketingPreLandingDynamic />;
}
