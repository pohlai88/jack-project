import { ArchitectureDeck } from './ArchitectureDeck';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { architecture } from '../_content/sections';

export function ArchitectureSection() {
  return (
    <MarketingSection id="architecture" className="marketing-section--tall" aria-labelledby="architecture-title">
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
          <p className="marketing-eyebrow">Section 06 · Architecture</p>
          <h2 id="architecture-title" className="marketing-h1">
            {architecture.title}
          </h2>
          <p className="marketing-lead">{architecture.lead}</p>
          <AudienceChips sectionId="architecture" />
        </div>
        <DeepDiveTrigger explorerId="architecture" label="Open architecture explorer" />
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <ArchitectureDeck />
      </div>
    </MarketingSection>
  );
}
