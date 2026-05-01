import type { Metadata } from 'next';

import { DevUsersPanel } from '@/app/DevUsersPanel';
import { defaultLocale, locales } from '@/i18n/config';
import { AFENDA_METADATA_IMAGE, AFENDA_METADATA_IMAGE_URL } from '@/shared/components/brand/metadata';

import { ActDivider } from './_components/ActDivider';
import { metadata as marketingMetadata } from './_content/sections';
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

const pageTitle = marketingMetadata.title;
const pageDescription = marketingMetadata.description;

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com').replace(/\/$/, '');
}

function resolveLocale(locale: string) {
  return locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = getSiteUrl();
  const resolvedLocale = resolveLocale(locale);
  const canonicalUrl = `${siteUrl}/${resolvedLocale}`;

  const languageAlternates = Object.fromEntries(
    locales.map((localeCode) => [localeCode, `${siteUrl}/${localeCode}`]),
  ) as Record<string, string>;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...marketingMetadata.keywords],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
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
      description: marketingMetadata.openGraphDescription,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Afenda',
      locale: resolvedLocale.replace('-', '_'),
      images: [
        {
          ...AFENDA_METADATA_IMAGE,
          alt: 'Afenda — Business Truth Infrastructure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: marketingMetadata.openGraphDescription,
      images: [AFENDA_METADATA_IMAGE_URL],
    },
  };
}

export default function MarketingPage() {
  const showDevUsersPanel = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_STAGE === 'dev';

  return (
    <main className="marketing-page" data-surface="marketing-home">
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

      {showDevUsersPanel ? <DevUsersPanel /> : null}
    </main>
  );
}
