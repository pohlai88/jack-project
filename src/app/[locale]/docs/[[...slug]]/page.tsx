import { createAPIPage } from 'fumadocs-openapi/ui';
import { Banner } from 'fumadocs-ui/components/banner';
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getDocsOgImageUrlPath } from '@/docs/runtime/docs-og.resolver';
import { openapi } from '@/docs/runtime/docs-openapi.server';
import { source } from '@/docs/runtime/docs-source.registry';
import { getMDXComponents } from '@/mdx-components';

const DocsOpenAPIPage = createAPIPage(openapi);

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

function getFallbackBannerId(locale: string, pageUrl: string): string {
  const stablePageKey = pageUrl.replaceAll(/[^a-zA-Z0-9_-]/g, '-').replaceAll(/-+/g, '-');
  return `docs-locale-fallback-${locale}-${stablePageKey}`;
}

export default async function Page(props: DocsPageProps) {
  const { locale, slug } = await props.params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const title = page.data.title;
  const description = page.data.description;
  const showFallbackNotice = isLocalizedFallbackPage(locale, page.absolutePath);
  const fallbackNotice = showFallbackNotice ? (await getTranslations('docs'))('fallbackNotice') : null;
  const isFullWidthPage = page.type === 'openapi' ? false : (page.data.full ?? false);
  const lastModified = page.type === 'openapi' ? undefined : page.data.lastModified;

  return (
    <DocsPage toc={page.data.toc} full={isFullWidthPage}>
      <DocsTitle>{title}</DocsTitle>
      {description ? <DocsDescription>{description}</DocsDescription> : null}
      {lastModified instanceof Date ? <PageLastUpdate date={lastModified} /> : null}
      <DocsBody>
        {fallbackNotice ? (
          <Banner id={getFallbackBannerId(locale, page.url)} changeLayout={false}>
            {fallbackNotice}
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
    </DocsPage>
  );
}
