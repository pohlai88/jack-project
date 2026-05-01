import type { Metadata } from 'next';

import { DevUsersPanel } from '@/app/DevUsersPanel';

import { ActDivider } from './_components/ActDivider';
import { InlineExplorerSection } from './_components/InlineExplorerSection';
import { ArchitectureExplorerBody } from './_explorers/ArchitectureExplorerBody';
import { ModularExplorerBody } from './_explorers/ModularExplorerBody';
import { OntologyObjectExplorerBody } from './_explorers/OntologyObjectExplorerBody';
import { OperationsExplorerBody } from './_explorers/OperationsExplorerBody';
import { ProcurementExplorerBody } from './_explorers/ProcurementExplorerBody';
import { ArchitectureSection } from './_sections/ArchitectureSection';
import { EvidenceSection } from './_sections/EvidenceSection';
import { HeroSection } from './_sections/HeroSection';
import { ModularSection } from './_sections/ModularSection';
import { OntologySection } from './_sections/OntologySection';
import { OperationsSection } from './_sections/OperationsSection';
import { ProcurementSection } from './_sections/ProcurementSection';
import { SecuritySection } from './_sections/SecuritySection';
import { ThesisSection } from './_sections/ThesisSection';
import { VerdictSection } from './_sections/VerdictSection';

export const metadata: Metadata = {
  title: 'Afenda — Business Truth Infrastructure',
  description:
    'Afenda is the business truth engine. Canonical records, 7W1H evidence, tenant-scoped truth, policy-bound execution, and audit-ready state for enterprise operations.',
  keywords: [
    'business truth engine',
    'canonical records',
    '7W1H audit trail',
    'tenant truth',
    'policy-bound execution',
    'audit infrastructure',
    'enterprise operations platform',
    'governed business data',
  ],
  openGraph: {
    title: 'Afenda — Business Truth Infrastructure',
    description: 'The business truth engine for governed operations.',
    type: 'website',
    siteName: 'Afenda',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afenda — Business Truth Infrastructure',
    description: 'The business truth engine for governed operations.',
  },
};

/**
 * Marketing home page — locale root (/{locale}/)
 *
 * Server Component (async) that composes the marketing landing page as one
 * continuous scrollable surface divided into five editorial acts.
 *
 * Layout responsibility (not here):
 * - Nav, footer, explorer modal, providers (see layout.tsx)
 *
 * This page responsibility:
 * - Typed hero section
 * - Act dividers (editorial structure)
 * - Content sections (thesis, ontology, procurement, operations, architecture,
 *   security, evidence, modular, verdict)
 * - Inline explorer sections (non-modal fallback content)
 * - Dev-only utilities (DevUsersPanel)
 */
export default async function MarketingPage() {
  const isDevStage = process.env.NEXT_PUBLIC_STAGE === 'dev' || process.env.NODE_ENV === 'development';

  return (
    <>
      <HeroSection />

      <ActDivider num="I" title="Declaration" />
      <ThesisSection />

      <ActDivider num="II" title="Business model of truth" />
      <OntologySection />
      <InlineExplorerSection id="ontology-object" label="Ontology object explorer">
        <OntologyObjectExplorerBody />
      </InlineExplorerSection>
      <ProcurementSection />
      <InlineExplorerSection id="procurement" label="Procurement explorer">
        <ProcurementExplorerBody />
      </InlineExplorerSection>
      <OperationsSection />
      <InlineExplorerSection id="operations" label="Operations explorer">
        <OperationsExplorerBody />
      </InlineExplorerSection>

      <ActDivider num="III" title="Platform proof" />
      <ArchitectureSection />
      <InlineExplorerSection id="architecture" label="Architecture explorer">
        <ArchitectureExplorerBody />
      </InlineExplorerSection>
      <SecuritySection />
      <EvidenceSection />

      <ActDivider num="IV" title="Extensibility" />
      <ModularSection />
      <InlineExplorerSection id="modular" label="Modular explorer">
        <ModularExplorerBody />
      </InlineExplorerSection>

      <ActDivider num="V" title="Close" />
      <VerdictSection />

      {isDevStage ? <DevUsersPanel /> : null}
    </>
  );
}
