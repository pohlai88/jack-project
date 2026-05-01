import type { Metadata } from 'next';
import { DevUsersPanel } from '@/app/DevUsersPanel';
import { defaultLocale, locales } from '@/i18n/config';

import { ActDivider } from './_components/ActDivider';
import { MarketingPreLandingLazy as MarketingPreLanding } from './_components/MarketingPreLandingLazy';
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

const pageTitle = 'Afenda — Business Truth Infrastructure';
const pageDescription =
  'Afenda is the business truth engine. Canonical records, 7W1H evidence, tenant-scoped truth, policy-bound execution, and audit-ready state for enterprise operations.';
const pageKeywords = [
  'business truth engine',
  'canonical records',
  '7W1H audit trail',
  'tenant truth',
  'policy-bound execution',
  'audit infrastructure',
  'enterprise operations platform',
  'governed business data',
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com';
  const canonicalUrl = `${siteUrl}/${locale}`;

  const languageAlternates = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])) as Record<string, string>;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        'x-default': `${siteUrl}/${defaultLocale}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: 'The business truth engine for governed operations.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'Afenda',
      locale: locale.replace('-', '_'),
      images: [
        {
          url: '/icons/afenda-icon-512-transparent.png',
          width: 512,
          height: 512,
          alt: 'Afenda — Business Truth Infrastructure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: 'The business truth engine for governed operations.',
      images: ['/icons/afenda-icon-512-transparent.png'],
    },
  };
}

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
 * - Dev-only utilities (DevUsersPanel)
 */
export default function MarketingPage() {
  const isDevStage = process.env.NEXT_PUBLIC_STAGE === 'dev' || process.env.NODE_ENV === 'development';

  return (
    <>
      <MarketingPreLanding />
      <HeroSection />

      <ActDivider num="I" title="Declaration" />
      <ThesisSection />

      <ActDivider num="II" title="Business model of truth" />
      <OntologySection />
      <ProcurementSection />
      <OperationsSection />

      <ActDivider num="III" title="Platform proof" variant="bridge" />
      <ArchitectureSection />
      <SecuritySection />
      <EvidenceSection />

      <ActDivider num="IV" title="Extensibility" />
      <ModularSection />

      <ActDivider num="V" title="Close" />
      <VerdictSection />

      {isDevStage ? <DevUsersPanel /> : null}
    </>
  );
}
