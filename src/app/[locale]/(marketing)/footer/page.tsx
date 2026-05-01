import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { defaultFooterDocuments, getLocalizedFooterDocuments } from './_content/footer-documents';
import { buildFooterDocPageMetadata } from './_lib/footer-doc-metadata';
import { MarketingServerLink } from '../_components/MarketingServerLink';

const footerIndexTitle = 'Footer governance hub — Afenda';
const footerIndexDescription =
  'Index of footer-linked legal memoranda, authority notes, compliance desks, and operational dossiers.';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildFooterDocPageMetadata({
    locale,
    pathAfterLocale: 'footer',
    title: footerIndexTitle,
    description: footerIndexDescription,
  });
}

export default async function FooterDocumentIndexPage() {
  const t = await getTranslations('landing.footerDocs');
  const footerDocuments = getLocalizedFooterDocuments(t);

  const ui = {
    kicker: t.has('index.kicker') ? t('index.kicker') : 'Footer Governance Hub',
    title: t.has('index.title') ? t('index.title') : 'Marketing Footer Legal Documents',
    description: t.has('index.description')
      ? t('index.description')
      : 'Central index of all individual footer legal, compliance, and authority documents. Each page is structured for counsel review and evidentiary traceability.',
    openDossier: t.has('index.openDossier') ? t('index.openDossier') : 'Open dossier',
  };

  const docsToRender = footerDocuments.length ? footerDocuments : defaultFooterDocuments;

  return (
    <section className="landing-section" aria-labelledby="footer-index-title">
      <div className="landing-shell">
        <header className="landing-headline">
          <p className="landing-kicker">{ui.kicker}</p>
          <h1 id="footer-index-title">{ui.title}</h1>
          <p>{ui.description}</p>
        </header>

        <div className="landing-grid" style={{ marginTop: '1.25rem', gap: '0.9rem' }}>
          {docsToRender.map((doc) => (
            <article key={doc.slug} className="landing-panel">
              <h2>{doc.title}</h2>
              <p>{doc.subtitle}</p>
              <p style={{ marginTop: '0.65rem' }}>
                <MarketingServerLink className="marketing-footer__link" href={`/footer/${doc.slug}`}>
                  {ui.openDossier}
                </MarketingServerLink>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
