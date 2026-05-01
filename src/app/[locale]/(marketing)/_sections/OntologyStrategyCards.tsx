'use client';

import { useMarketingExplorer } from '../_components/MarketingExplorerProvider';

const ontologyStrategyCards = [
  {
    step: '01',
    title: 'Canonical objects',
    body: 'Tenant, supplier, customer, item, contract, invoice, payment, shipment, and audit event share one governed model.',
    proof: 'object map',
  },
  {
    step: '02',
    title: 'Doctrine bands',
    body: 'Each object carries properties, functions, actions, and automations instead of screen-bound behavior.',
    proof: '4-band contract',
  },
  {
    step: '03',
    title: 'Audit event hub',
    body: 'Writes resolve through a central evidence hub so lineage survives across systems and actions.',
    proof: 'lineage pinned',
  },
  {
    step: '04',
    title: 'Policy at action time',
    body: 'Truth resolves when object, policy, evidence, and purpose agree at the moment work is executed.',
    proof: 'governed execution',
  },
] as const;

export function OntologyStrategyCards() {
  const { open } = useMarketingExplorer();

  return (
    <div className="ontology-strategy" aria-label="Ontology strategic system">
      {ontologyStrategyCards.map((card) => (
        <button
          key={card.step}
          type="button"
          className="ontology-strategy__card"
          onClick={() => open('ontology-object')}
          aria-label={`Open ontology deep dive: ${card.title}`}
        >
          <span className="ontology-strategy__step">{card.step}</span>
          <span className="ontology-strategy__title">{card.title}</span>
          <span className="ontology-strategy__body">{card.body}</span>
          <span className="ontology-strategy__proof">{card.proof}</span>
        </button>
      ))}
    </div>
  );
}
