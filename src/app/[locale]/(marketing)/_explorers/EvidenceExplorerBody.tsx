'use client';

import { EvidencePack } from '../_sections/EvidencePack';

const EVIDENCE_DEPTH = [
  {
    label: 'Canonical bytes',
    detail: 'Normalize the record before hashing so replay produces the same digest.',
  },
  {
    label: 'Tenant attestation',
    detail: 'Bind the evidence packet to the responsible tenant key and purpose.',
  },
  {
    label: 'Lineage chain',
    detail: 'Connect invoice, reversal, payment, and exception records into one replay path.',
  },
] as const;

export function EvidenceExplorerBody() {
  return (
    <div className="evidence-explorer">
      <div className="evidence-explorer__copy">
        <p className="marketing-mono">Audit pack / deep dive</p>
        <h3>The diagram lives behind the evidence terms.</h3>
        <p>
          The visible section names the professional evidence controls. This explorer keeps the packet diagram for hash,
          signature, lineage, and replay review.
        </p>
      </div>

      <div className="evidence-explorer__grid">
        <div className="evidence-explorer__rows">
          {EVIDENCE_DEPTH.map((row) => (
            <article key={row.label} className="evidence-explorer__row">
              <h4>{row.label}</h4>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
        <EvidencePack />
      </div>
    </div>
  );
}
