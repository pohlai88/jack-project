import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';

import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/docs-llm-rate-limit.server';
import { getLLMText } from '@/docs/runtime/docs-llm-text.serializer';
import { source } from '@/docs/runtime/docs-source.registry';
import { routing } from '@/i18n/routing';

interface LLMDocsRouteProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export const revalidate = false;
export const dynamic = 'force-dynamic';

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
