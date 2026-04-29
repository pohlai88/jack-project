import { resolveLlmsExportLocale } from '@/docs/runtime/docs-llm-locale.resolver';
import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/docs-llm-rate-limit.server';
import { getLLMText } from '@/docs/runtime/docs-llm-text.serializer';
import { source } from '@/docs/runtime/docs-source.registry';

export const revalidate = false;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = resolveLlmsExportLocale(url.searchParams.get('locale'));
  const ip = getLlmsExportClientIp(request);
  if (!consumeLlmsExportRateLimit(`llms-full:${ip}`, 'full')) {
    return new Response('Too Many Requests', { status: 429 });
  }

  const pages = await Promise.all(source.getPages(locale).map((page) => getLLMText(page)));

  return new Response(pages.join('\n\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
