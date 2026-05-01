'use client';

import dynamic from 'next/dynamic';

const MarketingIntroSceneDynamic = dynamic(
  () =>
    import('./MarketingIntroScene').then((m) => ({
      default: m.MarketingIntroScene,
    })),
  { ssr: false },
);

export function MarketingIntroSceneLazy() {
  return <MarketingIntroSceneDynamic />;
}
