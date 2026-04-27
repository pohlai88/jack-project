import { llms } from 'fumadocs-core/source/llms';

import { resolveLlmsExportLocale } from '@/docs/runtime/docs-llm-locale';
import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/llms-export-rate-limit';
import { source } from '@/docs/runtime/source';

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
