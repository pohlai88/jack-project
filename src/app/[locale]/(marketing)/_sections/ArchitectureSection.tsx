import { ArchitectureDeck } from './ArchitectureDeck';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { ExplorerSummary } from '../_components/ExplorerSummary';
import { architecture } from '../_content/sections';

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="marketing-section marketing-section--tall"
      aria-labelledby="architecture-title"
    >
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

      <ExplorerSummary
        explorerId="architecture"
        bullets={[
          'Four governed decks · ontology language, engine, security, services',
          'Central object-graph node carries the only `--primary-halo` outside the hero',
          'Tiles are labelled artefacts, not decoration',
          'Decorative ribbons removed — every glow indicates real flow',
        ]}
      />
    </section>
  );
}
