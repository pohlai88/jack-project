'use client';

import { useMarketingExplorer } from './MarketingExplorerProvider';
import type { ExplorerId } from '../_content/explorers';
import { EXPLORERS } from '../_content/explorers';

type DeepDiveTriggerProps = {
  explorerId: ExplorerId;
  label: string;
};

export function DeepDiveTrigger({ explorerId, label }: DeepDiveTriggerProps) {
  const { open } = useMarketingExplorer();
  const meta = EXPLORERS[explorerId];

  return (
    <div className="marketing-deep-dive-trigger">
      <button type="button" className="marketing-btn" onClick={() => open(explorerId)}>
        <span className="marketing-dot marketing-dot--ok" aria-hidden />
        {label}
      </button>
      <a className="marketing-link" href={`#${meta.fallbackAnchor}`}>
        Summary
      </a>
    </div>
  );
}
