import { Banner } from 'fumadocs-ui/components/banner';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
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
import { getMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
  return source.generateParams('slug', 'locale');
}

interface DocsPageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export async function generateMetadata(props: DocsPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  const ogImagePath = getDocsOgImageUrlPath(page);

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: [{ url: ogImagePath, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImagePath],
    },
  };
}

function isFallbackPage(locale: string, absolutePath?: string) {
  if (locale === 'en' || !absolutePath) {
    return false;
  }

  return !absolutePath.replaceAll('\\', '/').includes(`/docs/content/${locale}/`);
}

export default async function Page(props: DocsPageProps) {
  const params = await props.params;
  const { locale, slug } = params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const markdownAbsoluteUrl = await getDocsPageMarkdownAbsoluteUrl(page.url);

  if (page.type === 'openapi') {
    return (
      <DocsPage toc={page.data.toc} full>
        <DocsTitle>{page.data.title}</DocsTitle>
        {page.data.description ? <DocsDescription>{page.data.description}</DocsDescription> : null}
        <DocsBody>
          <DocsOpenAPIPage {...page.data.getAPIPageProps()} />
        </DocsBody>
        <DocsPageFeedback pageUrl={page.url} pageTitle={page.data.title ?? page.url} />
      </DocsPage>
    );
  }

  const tDocs = await getTranslations('docs');
  const tLlm = await getTranslations('docs.llm');
  const MDX = page.data.body;
  const showFallbackNotice = isFallbackPage(locale, page.absolutePath);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsPageLlmActions
        markdownAbsoluteUrl={markdownAbsoluteUrl}
        copy={{
          copyMarkdownUrl: tLlm('copyMarkdownUrl'),
          openMarkdown: tLlm('openMarkdown'),
          copied: tLlm('copied'),
          copiedButton: tLlm('copiedButton'),
          copyFailed: tLlm('copyFailed'),
        }}
      />
      <DocsBody>
        {showFallbackNotice ? (
          <Banner id="docs-locale-fallback" changeLayout={false}>
            {tDocs('fallbackNotice')}
          </Banner>
        ) : null}
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <DocsPageFeedback pageUrl={page.url} pageTitle={page.data.title} />
    </DocsPage>
  );
}
