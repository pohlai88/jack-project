import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';

import { getLLMText } from '@/docs/runtime/get-llm-text';
import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/llms-export-rate-limit';
import { source } from '@/docs/runtime/source';
import { routing } from '@/i18n/routing';

interface LLMDocsRouteProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export const revalidate = false;

export async function GET(request: Request, { params }: LLMDocsRouteProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const ip = getLlmsExportClientIp(request);
  if (!consumeLlmsExportRateLimit(`llms.mdx:${ip}`, 'page')) {
    return new Response('Too Many Requests', { status: 429 });
  }

  const page = source.getPage(slug, locale);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams('slug', 'locale');
}
