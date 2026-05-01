import { getTranslations } from 'next-intl/server';

import { MarketingServerLink } from '../../_components/MarketingServerLink';
import { type FooterDocument, getLocalizedFooterDocuments } from '../_content/footer-documents';

type FooterDocumentShellProps = {
  doc: FooterDocument;
};

export async function FooterDocumentShell({ doc }: FooterDocumentShellProps) {
  const t = await getTranslations('landing.footerDocs');
  const localizedDoc = getLocalizedFooterDocuments(t).find((entry) => entry.slug === doc.slug) ?? doc;

  const ui = {
    kicker: t.has('ui.kicker') ? t('ui.kicker') : 'Footer Legal Dossier',
    purpose: t.has('ui.purpose') ? t('ui.purpose') : 'Purpose',
    contact: t.has('ui.contact') ? t('ui.contact') : 'Contact',
    responseStandard: t.has('ui.responseStandard') ? t('ui.responseStandard') : 'Response Standard',
    authorities: t.has('ui.authorities') ? t('ui.authorities') : 'Authorities and References',
    returnToIndex: t.has('ui.returnToIndex') ? t('ui.returnToIndex') : 'Return to footer document index',
  };

  return (
    <section className="landing-section" aria-labelledby="footer-doc-title">
      <div className="landing-shell">
        <header className="landing-headline">
          <p className="landing-kicker">{ui.kicker}</p>
          <h1 id="footer-doc-title">{localizedDoc.title}</h1>
          <p>{localizedDoc.subtitle}</p>
        </header>

        <div className="landing-panel-grid" style={{ marginTop: '1.25rem' }}>
          <article className="landing-panel">
            <h2>{ui.purpose}</h2>
            <p>{localizedDoc.purpose}</p>
          </article>
          <article className="landing-panel">
            <h2>{ui.contact}</h2>
            <p>
              <a href={`mailto:${localizedDoc.contact}`}>{localizedDoc.contact}</a>
            </p>
          </article>
          <article className="landing-panel">
            <h2>{ui.responseStandard}</h2>
            <p>{localizedDoc.responseStandard}</p>
          </article>
        </div>

        <div className="landing-grid" style={{ marginTop: '1.25rem', gap: '0.9rem' }}>
          {localizedDoc.sections.map((section) => (
            <article key={section.heading} className="landing-panel">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul style={{ marginTop: '0.7rem', paddingInlineStart: '1.1rem' }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        {localizedDoc.citations?.length ? (
          <section className="landing-panel" style={{ marginTop: '1.25rem' }}>
            <h2>{ui.authorities}</h2>
            <ul style={{ marginTop: '0.7rem', paddingInlineStart: '1.1rem' }}>
              {localizedDoc.citations.map((citation) => (
                <li key={citation.href} style={{ marginBottom: '0.45rem' }}>
                  <a href={citation.href} target="_blank" rel="noreferrer">
                    {citation.label}
                  </a>{' '}
                  — {citation.note}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div style={{ marginTop: '1rem' }}>
          <MarketingServerLink className="marketing-footer__link" href="/footer">
            {ui.returnToIndex}
          </MarketingServerLink>
        </div>
      </div>
    </section>
  );
}
