import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { evidence } from '../_content/sections';

const EVIDENCE_TERMS = [
  {
    term: 'Canonicalization',
    benefit: 'Stable record bytes produce the same hash across replays.',
  },
  {
    term: 'Detached signature',
    benefit: 'Tenant attestation travels with the record without mutating it.',
  },
  {
    term: 'Merkle lineage',
    benefit: 'Prior events and reversals can be proved without full export.',
  },
  {
    term: 'Timestamp authority',
    benefit: 'Event order is anchored outside application-local time.',
  },
  {
    term: 'Policy decision record',
    benefit: 'Approval basis is stored at decision time, not inferred later.',
  },
  {
    term: 'Retention lock',
    benefit: 'Evidence remains immutable through the audit window.',
  },
] as const;

function EvidenceTermsPanel() {
  return (
    <section className="evidence-terms" aria-label="Professional evidence terms">
      <div className="evidence-terms__header">
        <p>Evidence dossier</p>
        <span>AFD-EVD-008</span>
      </div>

      <div className="evidence-terms__hero">
        <span>Technical terms</span>
        <strong>Audit proof is engineered before the audit.</strong>
      </div>

      <div className="evidence-terms__grid">
        {EVIDENCE_TERMS.map((item) => (
          <article key={item.term} className="evidence-terms__card">
            <h3>{item.term}</h3>
            <p>{item.benefit}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function EvidenceSection() {
  return (
    <MarketingSection id="evidence" className="marketing-section--tall" aria-labelledby="evidence-title">
      <div className="marketing-frame evidence-section__frame">
        <div>
          <p className="marketing-eyebrow">Section 08 · Trust & evidence</p>
          <h2 id="evidence-title" className="marketing-h1">
            {evidence.title}
          </h2>
          <p className="marketing-lead">{evidence.lead}</p>
          <AudienceChips sectionId="evidence" />

          <div className="evidence-section__actions">
            <DeepDiveTrigger explorerId="evidence" label="Open evidence explorer" />
          </div>
        </div>

        <EvidenceTermsPanel />
      </div>
    </MarketingSection>
  );
}
