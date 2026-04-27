import matter from 'gray-matter';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { hashMarkdown } from './lib/docs-hash-utils.mjs';

const root = process.cwd();
const docsRoot = join(root, 'src/features/docs/content');
const docsNavGeneratedPath = join(root, 'src/features/docs/lib/docs-nav-pages.generated.json');
const docsLoaderPath = join(root, 'src/features/docs/lib/docs-content.ts');
const docsTypesPath = join(root, 'src/features/docs/types/index.ts');
const errors = [];
const allowedTranslationStatuses = new Set(['generated', 'reviewed', 'needs-review']);

function readConfiguredLocales() {
  const config = readFileSync(join(root, 'src/i18n/config.ts'), 'utf8');
  const match = config.match(/export const locales = \[([^\]]+)\] as const;/);
  if (match) {
    return match[1]
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }

  if (/export const locales = activeLocales;/.test(config)) {
    const registry = readFileSync(join(root, 'src/i18n/locale-registry.ts'), 'utf8');
    const activeLocalesMatch = registry.match(/export const activeLocales = \[([^\]]+)\] as const;/);
    if (!activeLocalesMatch) {
      throw new Error('Unable to parse activeLocales from src/i18n/locale-registry.ts');
    }

    return activeLocalesMatch[1]
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }

  throw new Error('Unable to parse locales from src/i18n/config.ts');
}

function requireTranslationMetadata(doc, englishDoc, locale) {
  const { relPath, parsed } = doc;
  const label = `src/features/docs/content/${locale}/${relPath}`;
  const translation = parsed.data.translation;

  if (!translation || typeof translation !== 'object' || Array.isArray(translation)) {
    errors.push(`${label} must define translation metadata.`);
    return;
  }

  if (translation.sourceLocale !== 'en') {
    errors.push(`${label} must set translation.sourceLocale to "en".`);
  }

  if (typeof translation.sourcePath !== 'string' || translation.sourcePath.trim() === '') {
    errors.push(`${label} must define translation.sourcePath as a non-empty string.`);
  } else if (translation.sourcePath !== englishDoc.relPath) {
    errors.push(
      `${label} translation.sourcePath "${translation.sourcePath}" does not match canonical English source "${englishDoc.relPath}".`,
    );
  }

  if (typeof translation.sourceHash !== 'string' || !/^[a-f0-9]{64}$/i.test(translation.sourceHash)) {
    errors.push(`${label} must define translation.sourceHash as a 64-character SHA-256 hex string.`);
  } else if (translation.sourceHash !== englishDoc.sourceHash) {
    errors.push(
      `${label} translation.sourceHash "${translation.sourceHash}" does not match canonical English source hash "${englishDoc.sourceHash}".`,
    );
  }

  if (!allowedTranslationStatuses.has(translation.status)) {
    errors.push(
      `${label} translation.status must be one of ${Array.from(allowedTranslationStatuses)
        .map((status) => `"${status}"`)
        .join(', ')}.`,
    );
  }
}

function compareBodyStructure({ locale, doc, englishDoc }) {
  const label = `src/features/docs/content/${locale}/${doc.relPath}`;
  const englishHeadings = englishDoc.parsed.content.match(/^#{1,6}\s+/gm)?.length ?? 0;
  const localizedHeadings = doc.parsed.content.match(/^#{1,6}\s+/gm)?.length ?? 0;

  if (localizedHeadings !== englishHeadings) {
    errors.push(
      `${label} has ${localizedHeadings} Markdown headings, but canonical English source "${englishDoc.relPath}" has ${englishHeadings}.`,
    );
  }
}

function walkDocs(dir, prefix = '') {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = readdirSync(dir, { withFileTypes: true });
  const docs = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      docs.push(...walkDocs(fullPath, relPath));
      continue;
    }

    if (entry.name.endsWith('.md')) {
      const slug = relPath.endsWith('/index.md')
        ? relPath.slice(0, -'/index.md'.length)
        : relPath.slice(0, -'.md'.length);

      docs.push({
        fullPath,
        relPath: relPath.replace(/\\/g, '/'),
        slug,
      });
    }
  }

  return docs;
}

function parseDoc(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    return { parsed, raw, error: null };
  } catch (error) {
    return { parsed: null, raw: null, error };
  }
}

function requireFrontmatterFields(doc, locale) {
  const { slug, relPath, parsed } = doc;
  const frontmatter = parsed.data;
  const label = `src/features/docs/content/${locale}/${relPath}`;

  for (const field of ['title', 'description', 'section', 'order']) {
    if (!(field in frontmatter)) {
      errors.push(`${label} is missing required frontmatter field "${field}" for slug "${slug}".`);
    }
  }

  if ('hidden' in frontmatter && typeof frontmatter.hidden !== 'boolean') {
    errors.push(`${label} must define frontmatter.hidden as a boolean when present.`);
  }

  if ('fallbackAllowedLocales' in frontmatter) {
    const value = frontmatter.fallbackAllowedLocales;
    const valid = Array.isArray(value) && value.every((entry) => typeof entry === 'string' && entry.trim() !== '');
    if (!valid) {
      errors.push(`${label} must define frontmatter.fallbackAllowedLocales as a string array when present.`);
    }
  }

  if (locale === 'en' && frontmatter.hidden !== true) {
    if (typeof frontmatter.navTitleKey !== 'string' || frontmatter.navTitleKey.trim() === '') {
      errors.push(
        `${label} must define frontmatter.navTitleKey (i18n key for the docs sidebar, e.g. docs.nav.overview; run pnpm docs:generate-nav).`,
      );
    } else if (!String(frontmatter.navTitleKey).startsWith('docs.nav.')) {
      errors.push(`${label} frontmatter navTitleKey must start with "docs.nav."`);
    }
  }
}

function getNavSlugs() {
  const raw = readFileSync(docsNavGeneratedPath, 'utf8');
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.pages)) {
    throw new Error('Invalid docs-nav-pages.generated.json: expected { pages: [...] }');
  }
  return new Set(data.pages.map((p) => p.slug));
}

function detectSilentFallback() {
  const loaderSource = readFileSync(docsLoaderPath, 'utf8');
  const typesSource = readFileSync(docsTypesPath, 'utf8');
  const hasEnglishFallback =
    /locale !== 'en'/.test(loaderSource) && /return getDocContent\('en', slug\);/.test(loaderSource);
  const hasFallbackMetadata =
    /requestedLocale/.test(typesSource) || /resolvedLocale/.test(typesSource) || /isFallback/.test(typesSource);

  if (hasEnglishFallback && !hasFallbackMetadata) {
    errors.push(
      'src/features/docs/lib/docs-content.ts falls back to English without exposing fallback metadata through src/features/docs/types/index.ts, so localized docs fallback is currently silent.',
    );
  }
}

const locales = readConfiguredLocales();
const canonicalLocale = 'en';
const canonicalDocs = walkDocs(join(docsRoot, canonicalLocale));
const canonicalDocMap = new Map();

for (const doc of canonicalDocs) {
  const result = parseDoc(doc.fullPath);
  if (result.error) {
    errors.push(
      `src/features/docs/content/${canonicalLocale}/${doc.relPath} has invalid frontmatter: ${result.error.message}`,
    );
    continue;
  }

  doc.parsed = result.parsed;
  doc.sourceHash = hashMarkdown(result.raw);
  canonicalDocMap.set(doc.slug, doc);
  requireFrontmatterFields(doc, canonicalLocale);
}

const navSlugs = getNavSlugs();

for (const slug of navSlugs) {
  if (!canonicalDocMap.has(slug)) {
    errors.push(`Navigation slug "${slug}" is missing its canonical English doc under src/features/docs/content/en.`);
  }
}

for (const [slug, doc] of canonicalDocMap) {
  const hidden = doc.parsed.data.hidden === true;
  if (!hidden && !navSlugs.has(slug)) {
    errors.push(`Canonical English doc "${slug}" is not covered by docs navigation and is not marked hidden: true.`);
  }
}

for (const locale of locales) {
  if (locale === canonicalLocale) {
    continue;
  }

  const localeDocs = walkDocs(join(docsRoot, locale));
  const localeDocMap = new Map(localeDocs.map((doc) => [doc.slug, doc]));

  for (const doc of localeDocs) {
    const result = parseDoc(doc.fullPath);
    if (result.error) {
      errors.push(
        `src/features/docs/content/${locale}/${doc.relPath} has invalid frontmatter: ${result.error.message}`,
      );
      continue;
    }

    doc.parsed = result.parsed;
    requireFrontmatterFields(doc, locale);

    const englishDoc = canonicalDocMap.get(doc.slug);
    if (!englishDoc) {
      errors.push(
        `Localized doc "src/features/docs/content/${locale}/${doc.relPath}" is orphaned because canonical English slug "${doc.slug}" does not exist.`,
      );
      continue;
    }

    requireTranslationMetadata(doc, englishDoc, locale);
    compareBodyStructure({ locale, doc, englishDoc });
  }

  for (const [slug, englishDoc] of canonicalDocMap) {
    if (localeDocMap.has(slug)) {
      continue;
    }

    const allowedLocales = englishDoc.parsed?.data.fallbackAllowedLocales ?? [];
    if (!Array.isArray(allowedLocales) || !allowedLocales.includes(locale)) {
      errors.push(
        `Localized doc "${locale}/${englishDoc.relPath}" is missing for canonical slug "${slug}" and is not listed in fallbackAllowedLocales.`,
      );
    }
  }
}

detectSilentFallback();

if (errors.length > 0) {
  console.error('docs check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `docs check passed for canonical locale ${canonicalLocale} across locales: ${locales.filter((locale) => locale !== canonicalLocale).join(', ') || 'none'}`,
);
