import { OntologyStrategyCards } from './OntologyStrategyCards';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { ontology } from '../_content/sections';

export function OntologySection() {
  return (
    <MarketingSection id="ontology" className="marketing-section--tall" aria-labelledby="ontology-title">
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
          <p className="marketing-eyebrow">Section 03 · Ontology</p>
          <h2 id="ontology-title" className="marketing-h1">
            {ontology.title}
          </h2>
          <p className="marketing-lead">{ontology.lead}</p>
          <AudienceChips sectionId="ontology" />
        </div>
        <DeepDiveTrigger explorerId="ontology-object" label="Open object explorer" />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <OntologyStrategyCards />
      </div>
    </MarketingSection>
  );
}
