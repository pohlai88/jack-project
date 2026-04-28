/**
 * CI / operator pipeline: Tolgee REST pull → unzip → normalize → compile → validate.
 * Requires `TOLGEE_API_KEY` (and optional Project API key aliases via tolgee-load-env).
 *
 * Usage:
 *   TOLGEE_API_KEY=… I18N_ALLOW_GENERATED_UPDATE=1 pnpm i18n:tolgee:ci
 *
 * @see .github/workflows/tolgee-i18n.yml
 */

import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { prepareTolgeeNormalizeInput } from './tolgee-ci-prepare-input.mjs';
import { loadTolgeeEnv } from './tolgee-load-env.mjs';

const root = process.cwd();

function run(cmd, args, env = process.env) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  const code = result.status ?? 1;
  if (code !== 0) {
    process.exit(code);
  }
}

function main() {
  loadTolgeeEnv();

  if (!process.env.TOLGEE_API_KEY?.trim()) {
    console.error('tolgee-ci: set TOLGEE_API_KEY (GitHub secret or env.config / .env.local).');
    process.exit(1);
  }

  run(process.execPath, ['scripts/with-env-config.mjs', 'node', 'scripts/tolgee-export-pull.mjs']);

  let inputAbs;
  try {
    inputAbs = prepareTolgeeNormalizeInput(root);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const jsonCount = readdirSync(inputAbs).filter((f) => f.endsWith('.json')).length;
  if (jsonCount === 0) {
    console.error('tolgee-ci: extract folder has no JSON.');
    process.exit(1);
  }

  const inputRel = join('src', 'i18n', 'catalogs', 'tolgee-staging', '_ci-normalize-input');
  const normalizeEnv = {
    ...process.env,
    I18N_ALLOW_GENERATED_UPDATE: process.env.I18N_ALLOW_GENERATED_UPDATE ?? '1',
  };

  run(
    process.execPath,
    [`scripts/tolgee-normalize.mjs`, `--input=${inputRel}`, '--write', '--allow-empty'],
    normalizeEnv,
  );

  run('pnpm', ['i18n:compile'], process.env);
  run('pnpm', ['i18n:validate'], process.env);

  console.log('tolgee-ci: pipeline completed.');
}

main();
