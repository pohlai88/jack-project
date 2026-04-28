import { source } from './source';

type InferPage = (typeof source)['$inferPage'];

/**
 * Open Graph image path for a docs page (same origin as the site).
 * Pattern: `/[locale]/og/docs/…/image.png` (aligned with next-intl `[locale]` routing).
 *
 * @see https://www.fumadocs.dev/docs/integrations/og/next
 */
export function getDocsOgImageUrlPath(page: InferPage): string {
  const pathname = new URL(page.url, 'https://docs.invalid').pathname;
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length < 2 || parts[1] !== 'docs') {
    const locale = parts[0] ?? 'en';
    return `/${locale}/og/docs/image.png`;
  }

  const locale = parts[0];
  const docSlug = parts.slice(2);
  const tail = [...docSlug, 'image.png'].join('/');
  return `/${locale}/og/docs/${tail}`;
}
