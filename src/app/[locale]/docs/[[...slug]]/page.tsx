import { Banner } from 'fumadocs-ui/components/banner';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { DocsPageFeedback } from '@/docs/feedback/client/docs-page-feedback';
import { getDocsOgImageUrlPath } from '@/docs/runtime/docs-og';
import { DocsPageLlmActions } from '@/docs/runtime/docs-page-llm-actions';
import { getDocsPageMarkdownAbsoluteUrl } from '@/docs/runtime/docs-site-url';
import { DocsOpenAPIPage } from '@/docs/runtime/openapi-api-page';
import { source } from '@/docs/runtime/source';
import { DocsHome } from '@/docs/ui/docs-home';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from '@/docs/ui/layouts/docs/page';
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

  const [markdownAbsoluteUrl, tDocs, tLlm] = await Promise.all([
    getDocsPageMarkdownAbsoluteUrl(page.url),
    getTranslations('docs'),
    getTranslations('docs.llm'),
  ]);

  const title = page.data.title;
  const description = page.data.description;
  const showFallbackNotice = isLocalizedFallbackPage(locale, page.absolutePath);
  const isFullWidthPage = page.type === 'openapi' ? false : (page.data.full ?? false);
  const isDocsHome = !slug || slug.length === 0;
  const lastModified = page.type === 'openapi' ? undefined : page.data.lastModified;
  const lastUpdated =
    lastModified instanceof Date
      ? new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(lastModified)
      : undefined;

  if (isDocsHome) {
    return (
      <DocsPage toc={[]} full>
        <DocsBody>
          <DocsHome locale={locale} />
        </DocsBody>
      </DocsPage>
    );
  }

  return (
    <DocsPage toc={page.data.toc} full={isFullWidthPage}>
      <DocsTitle>{title}</DocsTitle>
      {description ? <DocsDescription>{description}</DocsDescription> : null}
      <DocsPageLlmActions
        markdownAbsoluteUrl={markdownAbsoluteUrl}
        copy={{
          copyMarkdownUrl: tLlm('copyMarkdownUrl'),
          openMarkdown: tLlm('openMarkdown'),
          copied: tLlm('copied'),
          copiedButton: tLlm('copiedButton'),
          copyFailed: tLlm('copyFailed'),
        }}
        lastUpdated={lastUpdated}
      />
      <DocsBody>
        {showFallbackNotice ? (
          <Banner id={`docs-locale-fallback-${locale}-${page.url}`} changeLayout={false}>
            {tDocs('fallbackNotice')}
          </Banner>
        ) : null}
        {page.type === 'openapi' ? (
          <DocsOpenAPIPage {...page.data.getAPIPageProps()} />
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
