/**
 * Replace `landing.footerDocs` in each active fallback locale using English canonical
 * shape from `src/i18n/catalogs/source/en.json` plus string-level replacements from
 * `scripts/footer-docs-i18n-maps/<locale>.byEnglish.json` (English leaf → locale leaf).
 *
 * Does not translate URLs or email addresses (those keys are absent from the maps).
 *
 * Usage: `node scripts/footer-docs-apply-maps-to-fallbacks.mjs`
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const locales = ['zh-CN', 'vi', 'ms', 'es', 'id', 'th'];

function applyEnglishLeafMap(node, map) {
  if (typeof node === 'string') {
    return Object.prototype.hasOwnProperty.call(map, node) ? map[node] : node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => applyEnglishLeafMap(item, map));
  }

  if (node !== null && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, applyEnglishLeafMap(value, map)]));
  }

  return node;
}

const enPath = join(root, 'src/i18n/catalogs/source/en.json');
const en = JSON.parse(readFileSync(enPath, 'utf8'));
const canonicalFooterDocs = structuredClone(en.landing.footerDocs);

for (const locale of locales) {
  const mapPath = join(root, 'scripts/footer-docs-i18n-maps', `${locale}.byEnglish.json`);
  const catalogPath = join(root, 'src/i18n/catalogs/fallback', `${locale}.json`);

  const map = JSON.parse(readFileSync(mapPath, 'utf8'));
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

  if (!catalog.landing) {
    throw new Error(`Missing landing in ${catalogPath}`);
  }

  catalog.landing.footerDocs = applyEnglishLeafMap(structuredClone(canonicalFooterDocs), map);

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  process.stdout.write(`applied footerDocs map → ${catalogPath}\n`);
}
