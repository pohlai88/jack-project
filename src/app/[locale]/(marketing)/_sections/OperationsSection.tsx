'use client';

import { useState } from 'react';

import { OperationsBoard } from './OperationsBoard';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { ExplorerSummary } from '../_components/ExplorerSummary';
import { operations } from '../_content/sections';

export function OperationsSection() {
  const [tab, setTab] = useState<(typeof operations.tabs)[number]>(operations.tabs[0]);

  return (
    <section id="operations" className="marketing-section marketing-section--tall" aria-labelledby="operations-title">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p className="marketing-eyebrow">Section 05 · Operations</p>
          <h2 id="operations-title" className="marketing-h1">
            {operations.title}
          </h2>
          <p className="marketing-lead">{operations.lead}</p>
          <AudienceChips sectionId="operations" />
        </div>
        <DeepDiveTrigger explorerId="operations" label="Open operations explorer" />
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div className="marketing-tabs" role="tablist">
          {operations.tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`marketing-tab${tab === t ? ' is-active' : ''}`}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
        <span className="marketing-mono">Inputs → activated modules → outputs</span>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <OperationsBoard tab={tab} />
      </div>

      <ExplorerSummary
        explorerId="operations"
        bullets={[
          'Inputs (SAP / Oracle / Infor / Workday / Rippling) feed the modules — not the screens',
          'Activated modules per lane; rest stay quiet — no fake dashboard glow',
          'Outputs (Variance / COGS / OTIF) are derived, not entered',
          'Full isometric motion lives in the explorer; static board ships here',
        ]}
      />
    </section>
  );
}
