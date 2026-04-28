/**
 * Map Tolgee REST/CLI JSON exports under `tolgee-staging/` → `src/i18n/catalogs/generated/<locale>.json`,
 * aligned to `catalogs/source/en.json` via `alignLocaleCatalogToCanonicalShape`.
 *
 * Does not write `en` from Tolgee (canonical English stays `catalogs/source/en.json`).
 *
 * Usage:
 *   pnpm i18n:tolgee:normalize
 *   pnpm i18n:tolgee:normalize -- --input=src/i18n/catalogs/tolgee-staging/_my-unzip --dry-run
 *   I18N_ALLOW_GENERATED_UPDATE=1 pnpm i18n:tolgee:normalize -- --write
 *   pnpm i18n:tolgee:normalize -- --allow-empty   # exit 0 when only en.json / nothing to merge (CI)
 *
 * @see architecture/governance/evidence/i18n/TOLGEE_INTEGRATION.md
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import {
  alignLocaleCatalogToCanonicalShape,
  I18N_PATHS,
  loadCanonicalCatalog,
  readLocaleModel,
} from './lib/i18n-catalog-core.mjs';
import { expandDotKeys, resolveCatalogLocale, unwrapTolgeeLocaleWrapper } from './lib/tolgee-normalize-core.mjs';

const CANONICAL_LOCALE = 'en';

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function generatedCatalogUpdateAllowed() {
  return ['1', 'true', 'yes'].includes(String(process.env.I18N_ALLOW_GENERATED_UPDATE ?? '').toLowerCase());
}

function parseArgs(argv) {
  let inputDir = join(process.cwd(), 'src', 'i18n', 'catalogs', 'tolgee-staging');
  let mapPath = join(process.cwd(), 'src', 'i18n', 'tolgee-locale-map.json');
  let dryRun = false;
  let write = false;
  let allowEmpty = false;
  for (const a of argv) {
    if (a.startsWith('--input=')) inputDir = join(process.cwd(), a.slice('--input='.length));
    else if (a.startsWith('--locale-map=')) mapPath = join(process.cwd(), a.slice('--locale-map='.length));
    else if (a === '--dry-run') dryRun = true;
    else if (a === '--write') write = true;
    else if (a === '--allow-empty') allowEmpty = true;
  }
  return { inputDir, mapPath, dryRun, write, allowEmpty };
}

function loadLocaleMap(mapPath) {
  if (!existsSync(mapPath)) {
    console.error(`tolgee-normalize: missing ${mapPath}`);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(mapPath, 'utf8'));
  const tolgeeTagToCatalogLocale = raw.tolgeeTagToCatalogLocale;
  if (!tolgeeTagToCatalogLocale || typeof tolgeeTagToCatalogLocale !== 'object') {
    console.error('tolgee-normalize: tolgee-locale-map.json must contain object "tolgeeTagToCatalogLocale"');
    process.exit(1);
  }
  return tolgeeTagToCatalogLocale;
}

function main() {
  const root = process.cwd();
  const argv = process.argv.slice(2);
  const { inputDir, mapPath, dryRun, write: wantWrite, allowEmpty } = parseArgs(argv);

  if (!existsSync(inputDir)) {
    console.error(`tolgee-normalize: input directory not found: ${inputDir}`);
    process.exit(1);
  }

  const tolgeeTagToCatalogLocale = loadLocaleMap(mapPath);
  const model = readLocaleModel({ root });
  const errors = [];
  const canonical = loadCanonicalCatalog({ root, errors });
  if (!canonical || errors.length) {
    console.error(`tolgee-normalize: failed to load canonical en: ${errors.join('; ')}`);
    process.exit(1);
  }

  const jsonFiles = readdirSync(inputDir).filter((f) => f.endsWith('.json'));
  if (jsonFiles.length === 0) {
    console.error(`tolgee-normalize: no .json files in ${inputDir} — run pnpm i18n:tolgee:pull and unzip if needed.`);
    process.exit(1);
  }

  const planned = [];

  for (const file of jsonFiles) {
    const stem = basename(file, '.json');
    if (stem.startsWith('tolgee-export-')) {
      continue;
    }

    const resolved = resolveCatalogLocale(stem, tolgeeTagToCatalogLocale, model.activeLocales);
    if ('skip' in resolved) {
      console.warn(`tolgee-normalize: skip ${file}: ${resolved.skip}`);
      continue;
    }

    const { catalogLocale } = resolved;
    if (catalogLocale === CANONICAL_LOCALE) {
      console.warn(
        `tolgee-normalize: skip ${file}: English canonical is ${I18N_PATHS.sourceDir}/en.json (not overwritten from Tolgee).`,
      );
      continue;
    }

    const fullPath = join(inputDir, file);
    let data;
    try {
      data = JSON.parse(readFileSync(fullPath, 'utf8'));
    } catch (e) {
      console.error(`tolgee-normalize: invalid JSON ${fullPath}: ${e.message}`);
      process.exit(1);
    }

    data = expandDotKeys(data);
    const { messages } = unwrapTolgeeLocaleWrapper(data, null);
    const aligned = alignLocaleCatalogToCanonicalShape(canonical, messages);

    const outRel = `${I18N_PATHS.generatedDir}/${catalogLocale}.json`;
    planned.push({ file, catalogLocale, outRel, aligned });
  }

  if (planned.length === 0) {
    const msg =
      'tolgee-normalize: nothing to merge into generated (often only en.json after unzip — translate non-EN locales in Tolgee or check tolgee-locale-map.json).';
    if (allowEmpty) {
      console.warn(`${msg} (--allow-empty → exit 0)`);
      process.exit(0);
    }
    console.error(msg);
    process.exit(1);
  }

  for (const p of planned) {
    console.log(
      `${dryRun || !wantWrite ? '[dry-run]' : '[write]'} ${p.file} → ${p.outRel} (${model.localeNames[p.catalogLocale] ?? p.catalogLocale})`,
    );
  }

  const effectiveWrite = wantWrite && !dryRun;
  if (effectiveWrite && !generatedCatalogUpdateAllowed()) {
    console.error(
      'tolgee-normalize: refusing --write without I18N_ALLOW_GENERATED_UPDATE=1 (see i18n-catalog-core generated guard).',
    );
    process.exit(1);
  }

  if (!effectiveWrite) {
    console.log(
      'tolgee-normalize: no files written. Pass --write (and set I18N_ALLOW_GENERATED_UPDATE=1) to write generated catalogs; then pnpm i18n:compile && pnpm i18n:validate.',
    );
    process.exit(0);
  }

  for (const p of planned) {
    const fullOut = join(root, p.outRel);
    mkdirSync(dirname(fullOut), { recursive: true });
    writeFileSync(fullOut, stableJson(p.aligned), 'utf8');
  }

  console.log(`tolgee-normalize: wrote ${planned.length} file(s). Next: pnpm i18n:compile && pnpm i18n:validate`);
}

main();
