/**
 * List SHA-256 hashes of canonical English docs (one path + tab + hash per line):
 *   pnpm docs:hash
 *
 * After changing English frontmatter that affects `translation.sourceHash` in
 * non-English files, run:
 *   pnpm docs:hash --write
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { hashMarkdown } from './lib/docs-hash-utils.mjs';

const root = process.cwd();
const contentRoot = join(root, 'src/features/docs/content');
const canonicalRoot = join(contentRoot, 'en');

const writeMode = process.argv.includes('--write');

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

  return docs.sort();
}

if (!writeMode) {
  for (const relPath of walkDocs(canonicalRoot)) {
    const fullPath = join(canonicalRoot, relPath);
    const hash = hashMarkdown(readFileSync(fullPath, 'utf8'));
    console.log(`${relPath}\t${hash}`);
  }
} else {
  const enMap = new Map();
  for (const relPath of walkDocs(canonicalRoot)) {
    enMap.set(relPath, hashMarkdown(readFileSync(join(canonicalRoot, relPath), 'utf8')));
  }

  const locales = readdirSync(contentRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'en')
    .map((e) => e.name)
    .sort();

  let updated = 0;
  for (const locale of locales) {
    const localeDir = join(contentRoot, locale);
    for (const relPath of walkDocs(localeDir)) {
      const fullPath = join(localeDir, relPath);
      const raw = readFileSync(fullPath, 'utf8');
      if (!/sourceHash:\s*[a-f0-9]{64}/.test(raw)) {
        continue;
      }
      const enHash = enMap.get(relPath);
      if (enHash === undefined) {
        continue;
      }
      const next = raw.replace(/^([ \t]*sourceHash:\s*)[a-f0-9]{64}/m, (match, prefixPart) => `${prefixPart}${enHash}`);
      if (next === raw) {
        continue;
      }
      if (!next.includes(enHash)) {
        console.error(`Failed to update sourceHash in ${fullPath}`);
        process.exit(1);
      }
      writeFileSync(fullPath, next, 'utf-8');
      updated += 1;
    }
  }
  console.log(`docs:hash --write: updated sourceHash in ${updated} non-English doc(s).`);
}
