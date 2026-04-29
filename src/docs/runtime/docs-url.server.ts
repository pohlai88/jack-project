import 'server-only';

import { headers } from 'next/headers';

import { DOCS_LOCAL_DEV_ORIGIN, DOCS_MARKDOWN_EXTENSION } from './docs-runtime.contract';
import {
  firstHeaderValue,
  inferProtocolFromHost,
  normalizeHeaderProtocol,
  normalizeOrigin,
  normalizeSameOriginPath,
} from './docs-url.shared';

/**
 * Resolve the absolute docs site origin.
 *
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. forwarded host/proto headers
 * 3. host header
 *
 * Returns null when no trustworthy origin can be derived.
 */
export async function getDocsSiteOrigin(): Promise<string | null> {
  const configured = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (configured) return configured;

  const h = await headers();
  const host = firstHeaderValue(h.get('x-forwarded-host')) ?? firstHeaderValue(h.get('host'));

  if (!host) return null;

  const protocol = normalizeHeaderProtocol(h.get('x-forwarded-proto')) ?? inferProtocolFromHost(host);
  return normalizeOrigin(`${protocol}://${host}`);
}

/**
 * Build an absolute Markdown URL for a docs page.
 *
 * If the request origin is unavailable, returns a safe same-origin path fallback.
 */
export async function getDocsPageMarkdownAbsoluteUrl(pageUrl: string): Promise<string> {
  const markdownPath = toMarkdownPath(pageUrl);
  const origin = await getDocsSiteOrigin();

  return origin ? `${origin}${markdownPath}` : markdownPath;
}

/**
 * Same as `getDocsPageMarkdownAbsoluteUrl`, but deterministic for non-request contexts.
 */
export function getDocsPageMarkdownUrlWithFallbackOrigin(pageUrl: string): string {
  return `${resolveConfiguredDocsOrigin()}${toMarkdownPath(pageUrl)}`;
}

function resolveConfiguredDocsOrigin(): string {
  return normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ?? DOCS_LOCAL_DEV_ORIGIN;
}

function toMarkdownPath(pageUrl: string): string {
  const normalizedPath = normalizeSameOriginPath(pageUrl);
  const pathWithoutExtensionTarget = normalizedPath === '/' ? '/index' : normalizedPath;

  return `${pathWithoutExtensionTarget}${DOCS_MARKDOWN_EXTENSION}`;
}
