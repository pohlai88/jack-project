import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

import { locales } from '@/i18n';

import type { DocContent, DocFrontmatter } from '../types';

const CANONICAL_DOC_LOCALE = 'en';
const CONTENT_DIR = path.join(process.cwd(), 'src/features/docs/content');
const SEARCHABLE_DOC_LOCALES = new Set<string>(locales);

/**
 * Load a documentation page by locale and slug.
 * Returns null if the page doesn't exist.
 */
export function getDocContent(locale: string, slug: string): DocContent | null {
  return getDocContentInternal(locale, slug, locale);
}

function getDocContentInternal(requestedLocale: string, slug: string, locale: string): DocContent | null {
  // Try the exact path first
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.md`);

  // Also try index.md for section root pages
  const indexPath = path.join(CONTENT_DIR, locale, slug, 'index.md');

  let resolvedPath: string | null = null;
  if (fs.existsSync(filePath)) {
    resolvedPath = filePath;
  } else if (fs.existsSync(indexPath)) {
    resolvedPath = indexPath;
  }

  if (!resolvedPath) {
    // Fall back to English if locale content doesn't exist
    if (locale !== 'en') {
      return getDocContentInternal(requestedLocale, slug, 'en');
    }
    return null;
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: data as DocFrontmatter,
    content,
    slug,
    requestedLocale,
    resolvedLocale: locale,
    isFallback: requestedLocale !== locale,
  };
}

/**
 * Get all available doc slugs for a locale.
 */
export function getAllDocSlugs(locale: string = 'en'): string[] {
  const slugs: string[] = [];
  const baseDir = path.join(CONTENT_DIR, locale);

  if (!fs.existsSync(baseDir)) return slugs;

  function walk(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith('.md')) {
        const name = entry.name.replace('.md', '');
        if (name === 'index') {
          slugs.push(prefix);
        } else {
          slugs.push(prefix ? `${prefix}/${name}` : name);
        }
      }
    }
  }

  walk(baseDir, '');
  return slugs;
}

/**
 * Get all doc content for building search index.
 */
export function getAllDocContents(locale: string = 'en'): DocContent[] {
  const slugs = getAllDocSlugs(locale);
  const contents: DocContent[] = [];
  for (const slug of slugs) {
    const doc = getDocContent(locale, slug);
    if (doc) contents.push(doc);
  }
  return contents;
}

/**
 * Get docs for search using canonical English slugs.
 * This preserves native docs where present and returns visible English fallback docs
 * for active locales that do not have translated Markdown yet.
 */
export function getSearchableDocContents(locale: string = CANONICAL_DOC_LOCALE): DocContent[] {
  if (!SEARCHABLE_DOC_LOCALES.has(locale)) {
    return [];
  }

  const slugs = getAllDocSlugs(CANONICAL_DOC_LOCALE);
  const contents: DocContent[] = [];
  for (const slug of slugs) {
    const doc = getDocContent(locale, slug);
    if (doc) contents.push(doc);
  }
  return contents;
}
