/**
 * Prints leaf paths under landing.footerDocs (dot-separated) and JSON values as JSON lines,
 * for building mechanical translation overlays.
 *
 * Usage: `node scripts/extract-footer-docs-leaf-paths.mjs`
 */
import { readFileSync } from 'node:fs';

const en = JSON.parse(readFileSync(new URL('../src/i18n/catalogs/source/en.json', import.meta.url), 'utf8'));
const fd = en.landing.footerDocs;

/** @param {unknown} node */
/** @param {string} prefix */
function walk(node, prefix) {
  if (typeof node === 'string') {
    return [{ path: prefix, value: node }];
  }
  if (Array.isArray(node)) {
    const out = [];
    for (let i = 0; i < node.length; i++) {
      out.push(...walk(node[i], `${prefix}[${i}]`));
    }
    return out;
  }
  if (node && typeof node === 'object') {
    const out = [];
    for (const key of Object.keys(node)) {
      const next = prefix ? `${prefix}.${key}` : key;
      out.push(...walk(node[key], next));
    }
    return out;
  }
  return [];
}

const leaves = walk(fd, '');
process.stdout.write(`${JSON.stringify(leaves, null, 2)}\n`);
