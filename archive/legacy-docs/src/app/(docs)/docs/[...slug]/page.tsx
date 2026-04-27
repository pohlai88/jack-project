import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

import {
  DocsBreadcrumb,
  DocsContent,
  DocsPagination,
  DocsTableOfContents,
  getDocContent,
  getPrevNextPages,
} from '@/features/docs';

interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts.join('/');
  const locale = await getLocale();
  const doc = getDocContent(locale, slug);

  if (!doc) return { title: 'Not Found | Afenda Docs' };

  return {
    title: `${doc.frontmatter.title} | Afenda Docs`,
    description: doc.frontmatter.description ?? `Afenda documentation — ${doc.frontmatter.title}`,
    openGraph: {
      title: `${doc.frontmatter.title} | Afenda Docs`,
      description: doc.frontmatter.description ?? `Afenda documentation — ${doc.frontmatter.title}`,
      type: 'article',
    },
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join('/');
  const locale = await getLocale();
  const t = await getTranslations('docs');

  const doc = getDocContent(locale, slug);
  if (!doc) notFound();

  const { prev, next } = getPrevNextPages(slug);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="min-w-0 flex-1">
        <DocsBreadcrumb slug={slug} />

        {doc.isFallback && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
            {t('fallbackNotice')}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{doc.frontmatter.title}</h1>
          {doc.frontmatter.description && (
            <p className="mt-2 text-lg text-muted-foreground">{doc.frontmatter.description}</p>
          )}
        </div>

        <DocsContent content={doc.content} />
        <DocsPagination prev={prev} next={next} />
      </article>

      {/* Table of contents — hidden on mobile/tablet */}
      <aside className="hidden xl:block w-56 shrink-0">
        <DocsTableOfContents content={doc.content} />
      </aside>
    </div>
  );
}
