import type { Metadata } from 'next';

import { defaultLocale, locales } from '@/i18n/config';
import { AFENDA_METADATA_IMAGE, AFENDA_METADATA_IMAGE_URL } from '@/shared/components/brand/metadata';

import { complianceFooterConfig } from '../_content/compliance-footer';
import {
  getLegalPageDocument,
  getLegalPageHref,
  legalAssurancePanels,
  type LegalDocumentKey,
} from '../_content/legal-pages';

type LegalRouteParams = {
  params: Promise<{ locale: string }>;
};

function buildLegalPageMetadata(key: LegalDocumentKey, locale: string): Metadata {
  const document = getLegalPageDocument(key);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com';
  const href = getLegalPageHref(key);
  const canonicalUrl = `${siteUrl}/${locale}${href}`;
  const languageAlternates = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${href}`])) as Record<
    string,
    string
  >;

  return {
    title: `${document.title} - Afenda`,
    description: document.description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        'x-default': `${siteUrl}/${defaultLocale}${href}`,
      },
    },
    openGraph: {
      title: `${document.title} - Afenda`,
      description: document.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Afenda',
      locale: locale.replace('-', '_'),
      images: [
        {
          ...AFENDA_METADATA_IMAGE,
          alt: `${document.title} - Afenda`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${document.title} - Afenda`,
      description: document.description,
      images: [AFENDA_METADATA_IMAGE_URL],
    },
  };
}

export function LegalPageContent({ pageKey }: { pageKey: LegalDocumentKey }) {
  const document = getLegalPageDocument(pageKey);
  const contactEmail = complianceFooterConfig.contacts[document.contact];

  return (
    <section
      className="landing-section legal-page"
      aria-labelledby={`${pageKey}-title`}
      data-legal-document-id={document.id}
      data-legal-version={document.version}
      data-legal-last-updated={document.lastUpdated}
      data-legal-status={document.status}
      data-legal-authority={document.authority}
      data-legal-requires-counsel={document.requiresCounselReview ? 'true' : 'false'}
      data-legal-evidence-required={document.evidence.required ? 'true' : 'false'}
    >
      <div className="landing-shell">
        <header className="landing-headline legal-page__headline">
          <p className="landing-kicker">{document.kicker}</p>
          <h1 id={`${pageKey}-title`}>{document.title}</h1>
          <p>{document.description}</p>
        </header>

        <aside className="legal-page__record" aria-label={`${document.title} governed document record`}>
          <dl className="legal-page__audit">
            <div>
              <dt>Document ID</dt>
              <dd>{document.id}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{document.version}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{document.lastUpdated}</dd>
            </div>
            <div>
              <dt>Lifecycle</dt>
              <dd>{document.status}</dd>
            </div>
            <div>
              <dt>Authority</dt>
              <dd>{document.authority}</dd>
            </div>
            <div>
              <dt>Jurisdiction</dt>
              <dd>{document.jurisdiction.join(' · ')}</dd>
            </div>
            <div>
              <dt>Counsel review</dt>
              <dd>{document.requiresCounselReview ? 'required' : 'not flagged'}</dd>
            </div>
            <div>
              <dt>Evidence linkage</dt>
              <dd>
                {document.evidence.required ? 'required' : 'not required'}
                {document.evidence.source ? ` (${document.evidence.source})` : ''}
                {document.evidencePolicy ? ` · ${document.evidencePolicy}` : ''}
              </dd>
            </div>
          </dl>

          {document.statusNote ? <p className="legal-page__status-note">{document.statusNote}</p> : null}

          <a href={`mailto:${contactEmail}`} className="legal-page__record-contact">
            {contactEmail}
          </a>
        </aside>

        <div className="legal-page__grid">
          {document.sections.map((section) => (
            <article key={section.title} className="landing-panel legal-page__panel">
              <h2>{section.title}</h2>
              {section.content.paragraphs?.map((paragraph, index) => (
                <p key={`${section.title}-p-${index}`}>{paragraph}</p>
              ))}
              {section.content.points?.length ? (
                <ul>
                  {section.content.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}

          {legalAssurancePanels.map((section) => (
            <article key={section.title} className="landing-panel legal-page__panel">
              <h2>{section.title}</h2>
              {section.content.paragraphs?.map((paragraph, index) => (
                <p key={`${section.title}-p-${index}`}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function createLegalDocumentPage(pageKey: LegalDocumentKey) {
  async function generateMetadata({ params }: LegalRouteParams): Promise<Metadata> {
    const { locale } = await params;
    return buildLegalPageMetadata(pageKey, locale);
  }

  function Page() {
    return <LegalPageContent pageKey={pageKey} />;
  }

  return { generateMetadata, Page };
}
