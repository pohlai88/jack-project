import { generate as OgImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { source } from '@/docs/runtime/source';

export const revalidate = false;

interface OgRouteProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export async function GET(_req: Request, props: OgRouteProps) {
  const { locale, slug } = await props.params;
  if (slug.length < 1 || slug[slug.length - 1] !== 'image.png') {
    notFound();
  }

  const docSlug = slug.slice(0, -1);
  const page = source.getPage(docSlug.length > 0 ? docSlug : undefined, locale);
  if (!page) {
    notFound();
  }

  return new ImageResponse(<OgImage title={page.data.title} description={page.data.description} site="Afenda Docs" />, {
    width: 1200,
    height: 630,
  });
}

export function generateStaticParams() {
  const rows = source.generateParams('slug', 'locale') as { slug?: string[]; locale: string }[];
  return rows.map(({ slug: slugParts, locale }) => ({
    locale,
    slug: [...(slugParts ?? []), 'image.png'],
  }));
}
