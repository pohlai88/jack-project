'use client';

import { MarketingIntroScene } from './MarketingIntroScene';

/**
 * Compatibility wrapper retained for the landing design-system audit contract.
 * The actual runtime intro is MarketingIntroScene.
 */
export function MarketingPreLanding() {
  return (
    <div className="marketing-pre-landing">
      <MarketingIntroScene />
    </div>
  );
}
