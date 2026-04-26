import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { hashMarkdown } from './lib/docs-hash-utils.mjs';

const root = process.cwd();
const canonicalRoot = join(root, 'src/features/docs/content/en');

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

for (const relPath of walkDocs(canonicalRoot)) {
  const fullPath = join(canonicalRoot, relPath);
  const hash = hashMarkdown(readFileSync(fullPath, 'utf8'));
  console.log(`${relPath}\t${hash}`);
}
