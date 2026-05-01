import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MarketingServerLink } from '../../_components/MarketingServerLink';
import { FooterDocumentShell } from '../_components/FooterDocumentShell';
import { defaultFooterDocumentBySlug, defaultFooterDocuments } from '../_content/footer-documents';
import { getFooterDocumentOrNotFound } from '../_content/get-footer-document';
import { buildFooterDocPageMetadata } from '../_lib/footer-doc-metadata';

type FooterSlugPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const PRIMARY_ACTION_BY_SLUG = {
  documentation: {
    href: '/docs',
    labelKey: 'ui.openPrimaryDocumentation',
    fallback: 'Open primary documentation',
  },
  'book-demo': {
    href: '/book-demo',
    labelKey: 'ui.openDemoScheduling',
    fallback: 'Open demo scheduling',
  },
} as const;

export function generateStaticParams() {
  return defaultFooterDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: FooterSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = defaultFooterDocumentBySlug[slug];
  if (!doc) {
    return { title: 'Not found — Afenda' };
  }

  return buildFooterDocPageMetadata({
    locale,
    pathAfterLocale: `footer/${slug}`,
    title: `${doc.title} — Afenda`,
    description: doc.subtitle,
  });
}

export default async function FooterSlugPage({ params }: FooterSlugPageProps) {
  const { slug } = await params;
  const doc = getFooterDocumentOrNotFound(slug);
  const primary = PRIMARY_ACTION_BY_SLUG[slug as keyof typeof PRIMARY_ACTION_BY_SLUG];

  if (!primary) {
    return <FooterDocumentShell doc={doc} />;
  }

  const t = await getTranslations('landing.footerDocs');
  const label = t.has(primary.labelKey) ? t(primary.labelKey) : primary.fallback;

  return (
    <>
      <FooterDocumentShell doc={doc} />
      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="landing-shell">
          <p>
            <MarketingServerLink className="marketing-footer__link" href={primary.href}>
              {label}
            </MarketingServerLink>
          </p>
        </div>
      </section>
    </>
  );
}
