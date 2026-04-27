/**
 * Generates `src/features/docs/lib/docs-nav-pages.generated.json` from
 * canonical English doc frontmatter (`section`, `order`, `navTitleKey`).
 *
 *   pnpm docs:generate-nav         — write the JSON
 *   pnpm docs:generate-nav --check — fail if the JSON is out of date
 */
import matter from 'gray-matter';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const enRoot = join(root, 'src/features/docs/content/en');
const outPath = join(root, 'src/features/docs/lib/docs-nav-pages.generated.json');

const checkMode = process.argv.includes('--check');

const ALLOWED_SECTIONS = new Set(['getting-started', 'member', 'admin', 'faq']);

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
      docs.push(relPath.replace(/\\/g, '/'));
    }
  }

  return docs;
}

/**
 * @param {string} relPath
 * @returns {string} slug
 */
function relPathToSlug(relPath) {
  if (relPath.endsWith('/index.md')) {
    return relPath.slice(0, -'/index.md'.length);
  }
  return relPath.replace(/\.md$/, '');
}

const relPaths = walkDocs(enRoot).sort();

/** @type {{ section: string; slug: string; order: number; titleKey: string }[]} */
const pages = [];

const errors = [];

for (const relPath of relPaths) {
  const fullPath = join(enRoot, relPath);
  const raw = readFileSync(fullPath, 'utf-8');
  const { data } = matter(raw);
  const slug = relPathToSlug(relPath);

  if (data.hidden === true) {
    continue;
  }

  if (typeof data.section !== 'string' || !ALLOWED_SECTIONS.has(data.section)) {
    errors.push(
      `${relPath}: missing or invalid frontmatter "section" (expected one of ${[...ALLOWED_SECTIONS].join(', ')}).`,
    );
    continue;
  }

  if (typeof data.order !== 'number' || !Number.isFinite(data.order)) {
    errors.push(`${relPath}: frontmatter "order" must be a number.`);
    continue;
  }

  if (typeof data.navTitleKey !== 'string' || data.navTitleKey.trim() === '') {
    errors.push(`${relPath}: frontmatter "navTitleKey" is required (i18n key for sidebar, e.g. docs.nav.overview).`);
    continue;
  }

  if (!data.navTitleKey.startsWith('docs.nav.')) {
    errors.push(`${relPath}: navTitleKey must start with "docs.nav."`);
  }

  pages.push({
    section: data.section,
    slug,
    order: data.order,
    titleKey: data.navTitleKey.trim(),
  });
}

if (errors.length > 0) {
  console.error('docs:generate-nav failed:\n');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

pages.sort((a, b) => {
  if (a.section !== b.section) {
    return a.section.localeCompare(b.section);
  }
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.slug.localeCompare(b.slug);
});

const payload = {
  version: 1,
  generated: true,
  description: 'Generated from src/features/docs/content/en. Run pnpm docs:generate-nav after editing doc frontmatter.',
  pages,
};

const nextJson = `${JSON.stringify(payload, null, 2)}\n`;

if (checkMode) {
  let current;
  try {
    current = readFileSync(outPath, 'utf-8');
  } catch {
    current = null;
  }
  if (current !== nextJson) {
    console.error('docs:generate-nav --check failed: docs-nav-pages.generated.json is out of date.');
    console.error('Run: pnpm docs:generate-nav');
    process.exit(1);
  }
  console.log('docs:generate-nav --check passed');
} else {
  writeFileSync(outPath, nextJson, 'utf-8');
  console.log(`wrote ${outPath} (${pages.length} pages)`);
}
