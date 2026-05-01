'use client';

import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib/utils';

import { useMarketingTruthInstrument } from './MarketingTruthInstrumentProvider';
import { getMarketingTruthTickPosition } from '../_content/truth-instrument';

type TruthStyle = CSSProperties & {
  '--truth-charge'?: string;
  '--truth-overall-charge'?: string;
  '--truth-tick-position'?: string;
};

export function MarketingTruthLadder() {
  const { enabled, state } = useMarketingTruthInstrument();

  if (!enabled) return null;

  return (
    <aside
      className={cn('marketing-truth-ladder', state.overallCharge > 0.015 && 'is-awake')}
      aria-label="Truth instrument ladder"
      style={{ '--truth-overall-charge': `${state.overallCharge}` } as TruthStyle}
    >
      <div className="marketing-truth-ladder__frame">
        <span className="marketing-truth-ladder__spine" aria-hidden="true" />
        <span className="marketing-truth-ladder__signal" aria-hidden="true" />

        {state.milestones.map((milestone) => (
          <section
            key={milestone.id}
            className={cn(
              'marketing-truth-ladder__module',
              `marketing-truth-ladder__module--${milestone.accent}`,
              `is-${milestone.state}`,
            )}
            style={{ '--truth-charge': `${milestone.charge}` } as TruthStyle}
          >
            <a
              href={`#${milestone.anchors[0].id}`}
              className="marketing-truth-ladder__module-hit"
              aria-current={milestone.id === state.activeMilestoneId ? 'step' : undefined}
              aria-label={`${milestone.label} resolution state`}
              title={milestone.label}
            />

            <div className="marketing-truth-ladder__module-shell">
              <div className="marketing-truth-ladder__module-copy">
                <span className="marketing-truth-ladder__module-label">{milestone.label}</span>
                <span className="marketing-truth-ladder__module-state">
                  {milestone.state === 'complete' ? 'Sealed' : milestone.state === 'active' ? 'Charging' : 'Queued'}
                </span>
              </div>

              <div className="marketing-truth-ladder__module-ticks" aria-hidden="true">
                <span className="marketing-truth-ladder__module-fill" />
              </div>

              <div className="marketing-truth-ladder__anchor-list">
                {milestone.anchors.map((anchor, index) => (
                  <a
                    key={anchor.id}
                    href={`#${anchor.id}`}
                    className={cn(
                      'marketing-truth-ladder__anchor',
                      `is-${anchor.state}`,
                      anchor.id === state.activeAnchorId && 'is-current',
                    )}
                    aria-current={anchor.id === state.activeAnchorId ? 'step' : undefined}
                    aria-label={anchor.label}
                    title={anchor.label}
                    style={
                      {
                        '--truth-charge': `${anchor.charge}`,
                        '--truth-tick-position': `${getMarketingTruthTickPosition(index, milestone.anchors.length)}%`,
                      } as TruthStyle
                    }
                  >
                    <span className="marketing-truth-ladder__anchor-dot" aria-hidden="true" />
                    <span className="marketing-truth-ladder__anchor-label">{anchor.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
