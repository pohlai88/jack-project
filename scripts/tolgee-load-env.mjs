/**
 * Load Afenda env for Tolgee tooling: `env.config` first, then merge `.env.local`
 * without overriding keys already set (env.config remains source of truth for duplicates).
 *
 * Canonical auth env for REST + CLI: **`TOLGEE_API_KEY`** (project API key or PAT).
 * If unset, **`PROJECT_API_KEY`** or **`TOLGEE_PERSONAL_ACCESS_TOKEN`** are mapped so
 * operators can keep Tolgee Cloud naming without duplication.
 */

import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { loadManagedEnvConfig } from './env-config.mjs';

function normalizeTolgeeApiKey() {
  if (process.env.TOLGEE_API_KEY?.trim()) return;
  const fromProject = process.env.PROJECT_API_KEY?.trim();
  const fromPat = process.env.TOLGEE_PERSONAL_ACCESS_TOKEN?.trim();
  if (fromProject) process.env.TOLGEE_API_KEY = fromProject;
  else if (fromPat) process.env.TOLGEE_API_KEY = fromPat;
}

/**
 * @param {string} [cwd]
 */
export function loadTolgeeEnv(cwd = process.cwd()) {
  loadManagedEnvConfig(cwd);
  const envLocal = join(cwd, '.env.local');
  if (existsSync(envLocal)) {
    dotenv.config({ path: envLocal, override: false });
  }
  normalizeTolgeeApiKey();
}
