import { Banner } from 'fumadocs-ui/components/banner';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getDocsOgImageUrlPath } from '@/docs/runtime/docs-og.resolver';
import { source } from '@/docs/runtime/docs-source.registry';
import { getDocsPageMarkdownAbsoluteUrl } from '@/docs/runtime/docs-url.server';
import { DocsPageFeedback } from '@/docs/ui/docs-feedback';
import { DocsOpenAPIAdapter } from '@/docs/ui/docs-openapi-adapter';
import { getMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
  return source.generateParams('slug', 'locale');
}

interface DocsPageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const ogImagePath = getDocsOgImageUrlPath(page);
  const title = page.data.title;
  const description = page.data.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImagePath, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImagePath],
    },
  };
}

function isLocalizedFallbackPage(locale: string, absolutePath?: string): boolean {
  if (locale === 'en' || !absolutePath) return false;

  const normalizedPath = absolutePath.replaceAll('\\', '/');

  return !normalizedPath.includes(`/content/i18n/docs/${locale}/`);
}

export default async function Page(props: DocsPageProps) {
  const { locale, slug } = await props.params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const [markdownAbsoluteUrl, tDocs] = await Promise.all([
    getDocsPageMarkdownAbsoluteUrl(page.url),
    getTranslations('docs'),
  ]);

  const title = page.data.title;
  const description = page.data.description;
  const showFallbackNotice = isLocalizedFallbackPage(locale, page.absolutePath);
  const isFullWidthPage = page.type === 'openapi' ? false : (page.data.full ?? false);
  const lastModified = page.type === 'openapi' ? undefined : page.data.lastModified;

  return (
    <DocsPage toc={page.data.toc} full={isFullWidthPage}>
      <DocsTitle>{title}</DocsTitle>
      {description ? <DocsDescription>{description}</DocsDescription> : null}
      <div className="not-prose docs-page-actions" aria-label="Documentation page actions">
        {lastModified instanceof Date ? <PageLastUpdate date={lastModified} /> : null}
        <div className="docs-page-actions__controls">
          <MarkdownCopyButton markdownUrl={markdownAbsoluteUrl} />
          <ViewOptionsPopover markdownUrl={markdownAbsoluteUrl} />
        </div>
      </div>
      <DocsBody>
        {showFallbackNotice ? (
          <Banner id={`docs-locale-fallback-${locale}-${page.url}`} changeLayout={false}>
            {tDocs('fallbackNotice')}
          </Banner>
        ) : null}
        {page.type === 'openapi' ? (
          <DocsOpenAPIAdapter {...page.data.getAPIPageProps()} />
        ) : (
          <page.data.body
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        )}
      </DocsBody>
      <DocsPageFeedback pageUrl={page.url} pageTitle={title ?? page.url} />
    </DocsPage>
  );
}
