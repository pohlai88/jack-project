import { OperationsBoard } from './OperationsBoard';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { operations } from '../_content/sections';

export function OperationsSection() {
  return (
    <MarketingSection id="operations" className="marketing-section--tall" aria-labelledby="operations-title">
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

      <div style={{ marginTop: '1.75rem' }}>
        <OperationsBoard />
      </div>
    </MarketingSection>
  );
}
