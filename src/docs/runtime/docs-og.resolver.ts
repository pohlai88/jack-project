import { DOCS_DEFAULT_LOCALE, DOCS_OG_BASE_PATH, DOCS_ROUTE_BASE_PATH } from './docs-runtime.contract';
import { source } from './docs-source.registry';
import { normalizeSameOriginPath, splitPathSegments } from './docs-url.shared';

type InferPage = (typeof source)['$inferPage'];

const DOCS_ROUTE_SEGMENT = DOCS_ROUTE_BASE_PATH.replace(/^\//, '');
const OG_IMAGE_FILE_NAME = 'image.png' as const;

/**
 * Resolve the same-origin Open Graph image path for a docs page.
 *
 * Expected page URL:
 *   /[locale]/docs/[...slug]
 *
 * Output:
 *   /[locale]/og/docs/[...slug]/image.png
 *
 * Invalid or non-doc routes fall back to:
 *   /[locale]/og/docs/image.png
 */
export function getDocsOgImageUrlPath(page: InferPage): string {
  const segments = splitPathSegments(normalizeSameOriginPath(page.url));
  const locale = segments[0] || DOCS_DEFAULT_LOCALE;

  if (!isDocsRoute(segments)) {
    return buildDocsOgFallbackPath(locale);
  }

  return buildDocsOgPath(locale, segments.slice(2));
}

function isDocsRoute(segments: string[]): boolean {
  return segments.length >= 2 && segments[1] === DOCS_ROUTE_SEGMENT;
}

function buildDocsOgFallbackPath(locale: string): string {
  return `/${locale}${DOCS_OG_BASE_PATH}/${OG_IMAGE_FILE_NAME}`;
}

function buildDocsOgPath(locale: string, slugSegments: string[]): string {
  if (slugSegments.length === 0) {
    return buildDocsOgFallbackPath(locale);
  }

  return `/${locale}${DOCS_OG_BASE_PATH}/${[...slugSegments, OG_IMAGE_FILE_NAME].join('/')}`;
}
