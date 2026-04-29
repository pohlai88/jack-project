/**
 * Validates internal links in docs MDX using next-validate-link (Fumadocs integration guide).
 *
 * Context7 /fuma-nama/fumadocs recommends importing `source` in CLI only after registering
 * `fumadocs-mdx/node/loader` in ESM, or running under Bun — not via tsx (esbuild breaks `.source/server.ts`).
 *
 * This script avoids `fumadocs-mdx:collections/server` and builds routes from `content/i18n/docs/**`
 * so `pnpm docs:links` works with `tsx` only.
 *
 * @see https://www.fumadocs.dev/docs/integrations/validate-links
 */

import fg from 'fast-glob';
import { printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { defaultLocale, locales } from '@/i18n/config';

const ROOT = process.cwd();
const DOCS_CONTENT_PREFIX = join('content', 'i18n', 'docs');

const localeSet = new Set(locales as readonly string[]);

/** Path segments under `content/i18n/docs/<locale>/…` → slug for `/[locale]/docs/[[...slug]]`. */
function relativePathToSlug(relativeUnderLocale: string): string[] {
  const normalized = relativeUnderLocale.replace(/\\/g, '/');
  if (normalized === 'index.mdx') return [];
  if (normalized.endsWith('/index.mdx')) {
    const dir = normalized.slice(0, -'/index.mdx'.length);
    return dir ? dir.split('/') : [];
  }
  const base = normalized.replace(/\.mdx$/, '');
  return base ? base.split('/') : [];
}

function toPublicPath(locale: string, slug: string[]): string {
  const tail = slug.length ? `/${slug.join('/')}` : '';
  return `/${locale}/docs${tail}`;
}

function addDocsAliases(urls: Set<string>, locale: string, path: string): void {
  urls.add(path);

  if (locale === defaultLocale && path.startsWith(`/${locale}/`)) {
    urls.add(path.slice(`/${locale}`.length) || '/');
  }
}

function extractLiteralHrefs(content: string): string[] {
  const hrefs: string[] = [];
  const hrefPattern = /\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/g;

  for (const match of content.matchAll(hrefPattern)) {
    const href = match[1] ?? match[2];
    if (href) hrefs.push(href);
  }

  return hrefs;
}

function normalizeDocsHref(href: string): string | null {
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) return null;

  const path = href.split('#')[0]?.split('?')[0] ?? href;
  if (path === '/docs' || path.startsWith('/docs/')) return path;
  if (path === `/${defaultLocale}/docs` || path.startsWith(`/${defaultLocale}/docs/`)) return path;

  return null;
}

function validateLiteralDocsHrefs(validDocsUrls: Set<string>): string[] {
  const errors: string[] = [];
  const files = fg.sync(
    [`${DOCS_CONTENT_PREFIX}/**/*.{md,mdx}`, 'src/docs/**/*.{ts,tsx}', 'src/app/**/docs/**/*.{ts,tsx}'],
    {
      cwd: ROOT,
      onlyFiles: true,
    },
  );

  for (const rel of files) {
    const abs = join(ROOT, rel);
    const content = readFileSync(abs, 'utf8');

    for (const href of extractLiteralHrefs(content)) {
      const docsHref = normalizeDocsHref(href);
      if (!docsHref || validDocsUrls.has(docsHref)) continue;

      errors.push(`${rel}: stale docs href "${href}".`);
    }
  }

  return errors;
}

export async function runDocsLinkValidation(): Promise<void> {
  const relFiles = fg.sync(`${DOCS_CONTENT_PREFIX}/**/*.{md,mdx}`, {
    cwd: ROOT,
    onlyFiles: true,
  });

  const populateEntries: {
    value: { locale: string; slug: string[] };
    hashes?: string[];
  }[] = [];

  const fileEntries: { path: string; content: string; url: string }[] = [];
  const validDocsUrls = new Set<string>();

  for (const rel of relFiles) {
    const parts = rel.replace(/\\/g, '/').split('/');
    if (parts.length < 5 || parts[0] !== 'content' || parts[1] !== 'i18n' || parts[2] !== 'docs') continue;

    const locale = parts[3];
    if (!localeSet.has(locale)) continue;

    const underLocale = parts.slice(4).join('/');
    const slug = relativePathToSlug(underLocale);
    const abs = join(ROOT, rel);
    const url = toPublicPath(locale, slug);
    const content = readFileSync(abs, 'utf8');

    populateEntries.push({
      value: { locale, slug },
    });

    fileEntries.push({ path: abs, content, url });
    addDocsAliases(validDocsUrls, locale, url);
  }

  const scanned = await scanURLs({
    cwd: ROOT,
    preset: 'next',
    populate: {
      '[locale]/docs/[[...slug]]': populateEntries,
    },
  });

  for (const fe of fileEntries) {
    try {
      const pathname = new URL(fe.url, 'https://docs.invalid').pathname;
      scanned.urls.set(pathname, {});
      const locale = fe.url.split('/')[1];
      if (locale === defaultLocale && pathname.startsWith(`/${locale}/`)) {
        scanned.urls.set(pathname.slice(`/${locale}`.length) || '/', {});
      }
    } catch {
      // ignore invalid URL edge cases
    }
  }

  const results = await validateFiles(fileEntries, {
    scanned,
    ignoreFragment: true,
    markdown: {
      components: {
        Card: { attributes: ['href'] },
      },
    },
    checkRelativePaths: 'as-url',
  });

  printErrors(results, true);

  const literalHrefErrors = validateLiteralDocsHrefs(validDocsUrls);
  if (literalHrefErrors.length > 0) {
    throw new Error(literalHrefErrors.join('\n'));
  }
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === entry) {
  void runDocsLinkValidation().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
