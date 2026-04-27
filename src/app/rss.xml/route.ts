import { getDocsRSS } from '@/docs/runtime/rss';

export const revalidate = false;

export function GET() {
  return new Response(getDocsRSS(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
