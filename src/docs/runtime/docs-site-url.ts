import { headers } from 'next/headers';

/**
 * Absolute origin for docs links (clipboard, RSS-style). Prefer NEXT_PUBLIC_APP_URL;
 * otherwise derive from request Host / forwarding headers.
 */
export async function getDocsSiteOrigin(): Promise<string | null> {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (configured) return configured;

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return null;

  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

export async function getDocsPageMarkdownAbsoluteUrl(pageUrl: string): Promise<string> {
  const origin = await getDocsSiteOrigin();
  const suffix = `${pageUrl}.mdx`;
  if (origin) return `${origin}${suffix}`;
  return suffix;
}
