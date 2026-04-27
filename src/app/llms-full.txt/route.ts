import { resolveLlmsExportLocale } from '@/docs/runtime/docs-llm-locale';
import { getLLMText } from '@/docs/runtime/get-llm-text';
import { consumeLlmsExportRateLimit, getLlmsExportClientIp } from '@/docs/runtime/llms-export-rate-limit';
import { source } from '@/docs/runtime/source';

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
