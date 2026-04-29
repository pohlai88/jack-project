import { getDocsRSS } from '@/docs/runtime/docs-rss.generator';

export const revalidate = false;

export function GET() {
  return new Response(getDocsRSS(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
