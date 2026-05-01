'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useMarketingExplorer } from './MarketingExplorerProvider';
import { type ExplorerId, getExplorer } from '../_content/explorers';

const OntologyObjectExplorerBody = dynamic(
  () => import('../_explorers/OntologyObjectExplorerBody').then((m) => m.OntologyObjectExplorerBody),
  { ssr: false },
);
const ProcurementExplorerBody = dynamic(
  () => import('../_explorers/ProcurementExplorerBody').then((m) => m.ProcurementExplorerBody),
  { ssr: false },
);
const OperationsExplorerBody = dynamic(
  () => import('../_explorers/OperationsExplorerBody').then((m) => m.OperationsExplorerBody),
  { ssr: false },
);
const ArchitectureExplorerBody = dynamic(
  () => import('../_explorers/ArchitectureExplorerBody').then((m) => m.ArchitectureExplorerBody),
  { ssr: false },
);
const SecurityExplorerBody = dynamic(
  () => import('../_explorers/SecurityExplorerBody').then((m) => m.SecurityExplorerBody),
  { ssr: false },
);
const EvidenceExplorerBody = dynamic(
  () => import('../_explorers/EvidenceExplorerBody').then((m) => m.EvidenceExplorerBody),
  { ssr: false },
);
const ModularExplorerBody = dynamic(
  () => import('../_explorers/ModularExplorerBody').then((m) => m.ModularExplorerBody),
  { ssr: false },
);

function ExplorerBody({ id }: { id: ExplorerId }) {
  switch (id) {
    case 'ontology-object':
      return <OntologyObjectExplorerBody />;
    case 'procurement':
      return <ProcurementExplorerBody />;
    case 'operations':
      return <OperationsExplorerBody />;
    case 'architecture':
      return <ArchitectureExplorerBody />;
    case 'security':
      return <SecurityExplorerBody />;
    case 'evidence':
      return <EvidenceExplorerBody />;
    case 'modular':
      return <ModularExplorerBody />;
    default:
      return null;
  }
}

export function MarketingExplorerDialog() {
  const { openId, close } = useMarketingExplorer();

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, openId]);

  useEffect(() => {
    if (!openId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openId]);

  if (!openId) return null;

  const meta = getExplorer(openId);

  return (
    <div className="marketing-modal" role="dialog" aria-modal="true" aria-label={meta.label}>
      <button type="button" className="marketing-modal__scrim" aria-label="Close overlay" onClick={close} />
      <div className="marketing-modal__shell">
        <header className="marketing-modal__header">
          <div>
            <p className="marketing-mono marketing-modal__eyebrow">Deep dive</p>
            <p className="marketing-modal__title">{meta.label}</p>
            <div className="marketing-modal__sub">
              <span className="marketing-mono">parent · #{meta.parentSection}</span>
            </div>
          </div>
          <button type="button" className="marketing-modal__close" onClick={close} aria-label="Close explorer">
            ×
          </button>
        </header>
        <div className="marketing-modal__body">
          <ExplorerBody id={openId} />
        </div>
      </div>
    </div>
  );
}
