import { OntologyGraph } from './OntologyGraph';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { ExplorerSummary } from '../_components/ExplorerSummary';
import { ontology } from '../_content/sections';

export function OntologySection() {
  return (
    <section id="ontology" className="marketing-section marketing-section--tall" aria-labelledby="ontology-title">
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
        <OntologyGraph />
      </div>

      <ExplorerSummary
        explorerId="ontology-object"
        bullets={[
          '9 canonical objects · Audit Event hub binds lineage on every write',
          'Each object carries Properties · Functions · Actions · Automations',
          'Truth resolution = object + policy + evidence at action time',
          'Reduced-motion users see facets statically — no functionality lost',
        ]}
      />
    </section>
  );
}
