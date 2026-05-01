import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { modular } from '../_content/sections';

const MODULAR_TERMS = [
  {
    label: 'SDK',
    title: 'Typed entrypoint',
    note: 'Ontology-aware TypeScript contracts.',
  },
  {
    label: 'API',
    title: 'Stable boundary',
    note: 'REST and gRPC surfaces with semver discipline.',
  },
  {
    label: 'Runtime',
    title: 'Tenant scope',
    note: 'Logic executes beside governed records.',
  },
  {
    label: 'Actions',
    title: 'Policy bound',
    note: 'Every mutation carries authority and evidence.',
  },
] as const;

function ModularTypographyPanel() {
  return (
    <section className="modular-type" aria-label="Modular capability typography">
      <div className="modular-type__header">
        <span>Build surface</span>
        <span>@afenda/sdk</span>
      </div>

      <div className="modular-type__statement">
        <span>Extend</span>
        <strong>without copying the spine.</strong>
      </div>

      <div className="modular-type__terms">
        {MODULAR_TERMS.map((term) => (
          <article key={term.label} className="modular-type__term">
            <span>{term.label}</span>
            <h3>{term.title}</h3>
            <p>{term.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ModularSection() {
  return (
    <MarketingSection id="modular" className="marketing-section--tall" aria-labelledby="modular-title">
      <div className="marketing-frame modular-section__frame">
        <div>
          <p className="marketing-eyebrow">Section 09 · Build on the spine</p>
          <h2 id="modular-title" className="marketing-h1">
            {modular.title}
          </h2>
          <p className="marketing-lead">{modular.lead}</p>
          <AudienceChips sectionId="modular" />

          <div className="modular-section__actions">
            <DeepDiveTrigger explorerId="modular" label="Open SDK playground" />
          </div>
        </div>

        <ModularTypographyPanel />
      </div>
    </MarketingSection>
  );
}
