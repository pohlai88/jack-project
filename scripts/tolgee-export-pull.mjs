/**
 * Optional Tolgee Platform export pull (PR 2 early slice — operator-only).
 *
 * Requires `TOLGEE_API_KEY` (never commit). Tolgee Cloud defaults base URL to `https://app.tolgee.io`;
 * set `TOLGEE_API_URL` only for self-hosted.
 *
 * Export URL: `GET …/v2/projects/export` when project id is omitted (typical **project API key**),
 * or `GET …/v2/projects/:projectId/export` when `TOLGEE_PROJECT_ID` is set (e.g. PAT workflows).
 * See https://docs.tolgee.io/api/export-data
 *
 * If `TOLGEE_API_KEY` is missing, exits 0 (CI-safe skip).
 *
 * Usage:
 *   pnpm i18n:tolgee:pull -- --languages=zh-CN
 *   pnpm i18n:tolgee:pull -- --languages=zh-CN --languages=en
 *
 * Tolgee returns JSON directly when a single file is exported; multiple languages
 * often yield a ZIP — in that case this script writes a .zip under tolgee-staging/
 * and prints manual unzip / tolgee CLI guidance.
 *
 * @see architecture/governance/evidence/i18n/TOLGEE_INTEGRATION.md
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadTolgeeEnv } from './tolgee-load-env.mjs';

const root = process.cwd();
const DEFAULT_OUT = join(root, 'src', 'i18n', 'catalogs', 'tolgee-staging');
const DEFAULT_TOLGEE_API_URL = 'https://app.tolgee.io';

function trimSlash(s) {
  return s.replace(/\/+$/, '');
}

function parseArgs(argv) {
  const languages = [];
  let outDir = DEFAULT_OUT;
  for (const a of argv) {
    if (a.startsWith('--languages=')) {
      languages.push(a.slice('--languages='.length));
    } else if (a.startsWith('--out=')) {
      outDir = join(root, a.slice('--out='.length));
    }
  }
  return { languages, outDir };
}

function isZip(buffer) {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
}

async function main() {
  loadTolgeeEnv();

  const apiKey = process.env.TOLGEE_API_KEY?.trim();
  const projectId = process.env.TOLGEE_PROJECT_ID?.trim();
  const apiUrlRaw = process.env.TOLGEE_API_URL?.trim();
  const base = trimSlash(apiUrlRaw || DEFAULT_TOLGEE_API_URL);
  const argv = process.argv.slice(2);
  const { languages, outDir } = parseArgs(argv);

  if (!apiKey) {
    console.error('tolgee-export-pull: skip (set TOLGEE_API_KEY)');
    process.exit(0);
  }
  const params = new URLSearchParams();
  params.set('format', 'JSON');
  for (const lang of languages) {
    if (lang) params.append('languages', lang);
  }

  const exportPath = projectId ? `/v2/projects/${encodeURIComponent(projectId)}/export` : '/v2/projects/export';
  const url = `${base}${exportPath}?${params.toString()}`;

  mkdirSync(outDir, { recursive: true });

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-Key': apiKey,
      Accept: 'application/json, application/zip, application/octet-stream, */*',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status} ${res.statusText}${body ? `: ${body.slice(0, 200)}` : ''}`);
    if (body.includes('no_exported_result')) {
      err.message += `\n  Hint: no strings to export for the requested filter. Translate at least one key into that language in Tolgee, or omit --languages to export all locales that have content.`;
      err.message += `\n  Tolgee language tags often differ from app locales (e.g. zh-Hans-CN vs zh-CN)—use the tag shown in Project → Languages.`;
    }
    throw err;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-');

  if (isZip(buf)) {
    const zipPath = join(outDir, `tolgee-export-${stamp}.zip`);
    writeFileSync(zipPath, buf);
    console.log(`tolgee-export-pull: wrote ZIP (${buf.length} bytes) to ${zipPath}`);
    console.log('  Unzip manually or use Tolgee CLI, then run: pnpm i18n:tolgee:spike-check <path-to-locale.json>');
    return;
  }

  const text = buf.toString('utf8').replace(/^\uFEFF/, '');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const rawPath = join(outDir, `tolgee-export-${stamp}.bin`);
    writeFileSync(rawPath, buf);
    throw new Error(`Response was not JSON or ZIP; wrote raw bytes to ${rawPath} for inspection.`);
  }

  const keys = typeof data === 'object' && data !== null && !Array.isArray(data) ? Object.keys(data) : [];
  const bcp47 = /^[a-z]{2}(-[A-Za-z0-9]+)?$/;
  let outName = `tolgee-export-${stamp}.json`;
  if (keys.length === 1 && bcp47.test(keys[0])) {
    outName = `${keys[0]}.json`;
  }

  const outPath = join(outDir, outName);
  writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`tolgee-export-pull: wrote JSON to ${outPath}`);
  console.log(`  Next: pnpm i18n:tolgee:spike-check ${outPath.replaceAll('\\', '/')}`);
}

main().catch((e) => {
  console.error(`tolgee-export-pull failed: ${e.message}`);
  process.exit(1);
});
