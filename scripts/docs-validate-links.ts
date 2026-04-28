/**
 * Validates internal links in docs MDX using next-validate-link (Fumadocs integration guide).
 *
 * Context7 /fuma-nama/fumadocs recommends importing `source` in CLI only after registering
 * `fumadocs-mdx/node/loader` in ESM, or running under Bun — not via tsx (esbuild breaks `.source/server.ts`).
 *
 * This script avoids `fumadocs-mdx:collections/server` and builds routes from `docs/content/**`
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
const DOCS_CONTENT_PREFIX = join('docs', 'content');

const localeSet = new Set(locales as readonly string[]);

/** Path segments under `docs/content/<locale>/…` → slug for `/[locale]/docs/[[...slug]]`. */
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

  for (const rel of relFiles) {
    const parts = rel.replace(/\\/g, '/').split('/');
    if (parts.length < 4 || parts[0] !== 'docs' || parts[1] !== 'content') continue;

    const locale = parts[2];
    if (!localeSet.has(locale)) continue;

    const underLocale = parts.slice(3).join('/');
    const slug = relativePathToSlug(underLocale);
    const abs = join(ROOT, rel);
    const url = toPublicPath(locale, slug);
    const content = readFileSync(abs, 'utf8');

    populateEntries.push({
      value: { locale, slug },
    });

    fileEntries.push({ path: abs, content, url });
  }

  const scanned = await scanURLs({
    cwd: ROOT,
    preset: 'next',
    populate: {
      '[locale]/(docs)/docs/[[...slug]]': populateEntries,
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
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === entry) {
  void runDocsLinkValidation().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
