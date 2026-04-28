/**
 * After `pnpm i18n:tolgee:pull`, extracts the newest `tolgee-export-*.zip` into
 * `src/i18n/catalogs/tolgee-staging/_ci-normalize-input/` for `tolgee-normalize`.
 * Fallback: copy non-export `*.json` from staging root into that folder.
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} [root]
 * @returns {string} Absolute path to folder containing locale `*.json` files for normalize.
 */
export function prepareTolgeeNormalizeInput(root = process.cwd()) {
  const staging = join(root, 'src', 'i18n', 'catalogs', 'tolgee-staging');
  const outDir = join(staging, '_ci-normalize-input');

  if (!existsSync(staging)) {
    mkdirSync(staging, { recursive: true });
  }

  const zips = readdirSync(staging)
    .filter((f) => f.startsWith('tolgee-export-') && f.endsWith('.zip'))
    .map((f) => ({ name: f, mtime: statSync(join(staging, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  if (zips.length > 0) {
    const zipPath = join(staging, zips[0].name);
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    try {
      execFileSync('unzip', ['-o', zipPath, '-d', outDir], { stdio: 'inherit' });
    } catch {
      if (process.platform === 'win32') {
        execFileSync(
          'powershell.exe',
          [
            '-NoProfile',
            '-Command',
            `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${outDir.replace(/'/g, "''")}' -Force`,
          ],
          { stdio: 'inherit' },
        );
      } else {
        throw new Error(
          'tolgee-ci-prepare-input: unzip failed (install unzip for CI, or unzip manually into _ci-normalize-input).',
        );
      }
    }
    return outDir;
  }

  const jsonInRoot = readdirSync(staging).filter((f) => f.endsWith('.json') && !f.startsWith('tolgee-export-'));

  if (jsonInRoot.length > 0) {
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    for (const f of jsonInRoot) {
      copyFileSync(join(staging, f), join(outDir, f));
    }
    return outDir;
  }

  throw new Error(
    'tolgee-ci-prepare-input: no tolgee-export-*.zip and no locale *.json in tolgee-staging root — run pnpm i18n:tolgee:pull first.',
  );
}
