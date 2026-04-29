import { llms } from 'fumadocs-core/source';

import { resolveLlmsExportLocale } from '@/docs/runtime/docs-llm-locale.resolver';
import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/docs-llm-rate-limit.server';
import { source } from '@/docs/runtime/docs-source.registry';

export const revalidate = false;

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = resolveLlmsExportLocale(url.searchParams.get('locale'));
  const ip = getLlmsExportClientIp(request);
  if (!consumeLlmsExportRateLimit(`llms.txt:${ip}`, 'index')) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return new Response(llms(source).index(locale), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
