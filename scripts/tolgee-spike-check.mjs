/**
 * PR 1B — Tolgee round-trip spike helper (no Tolgee SDK, no runtime).
 * Validates an exported JSON file keeps the canonical nested key paths and string leaves
 * (ICU placeholders preserved as substrings; naive brace balance for `{` / `}`).
 *
 * Usage:
 *   pnpm i18n:tolgee:spike-check
 *       Smoke-checks the committed canonical sample (self-test).
 *   pnpm i18n:tolgee:spike-check path/to/exported.json
 *       Validates Tolgee (or other) export against canonical structure.
 *
 * If the export wraps messages under a single locale key (e.g. { "zh-CN": { "common": ... } }),
 * pass --unwrap-locale=zh-CN or rely on auto-unwrap when exactly one top-level key looks like a BCP-47 tag.
 */

import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const CANONICAL = join(root, 'architecture', 'governance', 'evidence', 'i18n', 'tolgee-spike-sample-canonical.json');

const BCP47_LIKE = /^[a-z]{2}(-[A-Z][a-z]{3}|-[A-Z]{2})?$/;

function parseArgs(argv) {
  const args = { unwrapLocale: null, paths: [] };
  for (const a of argv) {
    if (a.startsWith('--unwrap-locale=')) {
      args.unwrapLocale = a.slice('--unwrap-locale='.length);
    } else if (!a.startsWith('-')) {
      args.paths.push(a);
    }
  }
  return args;
}

function unwrapLocaleWrapper(obj, forcedLocale) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return { messages: obj, detectedLocale: null };
  }
  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    return { messages: obj, detectedLocale: null };
  }
  const only = keys[0];
  const inner = obj[only];
  if (typeof inner !== 'object' || inner === null || Array.isArray(inner)) {
    return { messages: obj, detectedLocale: null };
  }
  if (forcedLocale && only === forcedLocale) {
    return { messages: inner, detectedLocale: only };
  }
  if (!forcedLocale && BCP47_LIKE.test(only) && ('common' in inner || 'tenant' in inner || 'audit' in inner)) {
    return { messages: inner, detectedLocale: only };
  }
  return { messages: obj, detectedLocale: null };
}

function icuBraceBalance(s) {
  let depth = 0;
  for (const ch of s) {
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

function assertLeafPaths(canonical, exported, pathPrefix = '') {
  if (typeof canonical === 'string') {
    if (typeof exported !== 'string') {
      throw new Error(`${pathPrefix || '<root>'}: expected string leaf, got ${typeof exported}`);
    }
    if (canonical.includes('{') && !icuBraceBalance(exported)) {
      throw new Error(`${pathPrefix}: ICU-like string has unbalanced { } in export`);
    }
    if (canonical.includes('plural') && !exported.includes('plural')) {
      throw new Error(`${pathPrefix}: expected ICU plural fragment to survive (substring "plural")`);
    }
    for (const marker of canonical.match(/\{[a-zA-Z_][a-zA-Z0-9_]*/g) || []) {
      if (!exported.includes(marker)) {
        throw new Error(`${pathPrefix}: ICU fragment ${marker} missing in export`);
      }
    }
    return;
  }
  if (canonical === null || Array.isArray(canonical)) {
    throw new Error(`${pathPrefix}: canonical sample must be nested objects and string leaves only`);
  }
  if (typeof canonical === 'object') {
    if (typeof exported !== 'object' || exported === null || Array.isArray(exported)) {
      throw new Error(`${pathPrefix}: expected object at export path`);
    }
    for (const k of Object.keys(canonical)) {
      const nextPath = pathPrefix ? `${pathPrefix}.${k}` : k;
      if (!(k in exported)) {
        throw new Error(`${nextPath}: missing key in export`);
      }
      assertLeafPaths(canonical[k], exported[k], nextPath);
    }
  }
}

function loadJson(path) {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  const raw = readFileSync(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${path}: ${e.message}`);
  }
}

function runCheck(exportPath, { unwrapLocale }) {
  const canonical = loadJson(CANONICAL);
  const exportedRaw = loadJson(exportPath);
  const { messages, detectedLocale } = unwrapLocaleWrapper(exportedRaw, unwrapLocale);

  assertLeafPaths(canonical, messages);

  const zhInPath = /zh-CN/i.test(basename(exportPath));
  const zhInLocale = detectedLocale === 'zh-CN';

  return {
    exportPath,
    detectedLocale,
    zhInPath,
    zhInLocale,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const exportPath = args.paths[0];

  if (!existsSync(CANONICAL)) {
    console.error(`Missing canonical sample: ${CANONICAL}`);
    process.exit(1);
  }

  try {
    if (!exportPath) {
      runCheck(CANONICAL, { unwrapLocale: args.unwrapLocale });
      console.log('tolgee-spike-check: canonical sample self-check passed.');
      console.log(`  canonical: ${CANONICAL}`);
      process.exit(0);
    }

    const meta = runCheck(exportPath, { unwrapLocale: args.unwrapLocale });
    console.log('tolgee-spike-check: export matches canonical nested paths and leaf ICU markers.');
    console.log(`  export: ${meta.exportPath}`);
    if (meta.detectedLocale) {
      console.log(`  unwrapped locale wrapper: ${meta.detectedLocale}`);
    }
    if (meta.zhInPath || meta.zhInLocale) {
      console.log('  hint: zh-CN present in filename or as wrapper key — record in spike table.');
    }
    process.exit(0);
  } catch (e) {
    console.error(`tolgee-spike-check failed: ${e.message}`);
    process.exit(1);
  }
}

main();
