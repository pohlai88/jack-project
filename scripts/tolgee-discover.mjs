/**
 * List Tolgee projects accessible with TOLGEE_API_KEY (PAT or org-scoped token).
 * Loads `env.config` then `.env.local` (see tolgee-load-env.mjs).
 *
 * Uses Tolgee Cloud / self-hosted REST: GET /v2/projects
 * (see https://docs.tolgee.io/ — same API family as export).
 *
 * Usage:
 *   pnpm i18n:tolgee:discover
 *   pnpm i18n:tolgee:discover -- 12345   # resolve one project by id (project API key friendly)
 *
 * If you use a **project-only** API key, listing all projects may return 401/403;
 * then read the project id from the Tolgee UI URL: …/projects/{id}/…
 */

import { loadTolgeeEnv } from './tolgee-load-env.mjs';

const DEFAULT_API = 'https://app.tolgee.io';

function trimSlash(s) {
  return s.replace(/\/+$/, '');
}

async function trySingleProject(base, apiKey, projectId) {
  const url = `${base}/v2/projects/${encodeURIComponent(projectId)}`;
  const res = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('tolgee-discover: single-project response was not JSON');
    process.exit(1);
  }
  if (!res.ok) {
    console.error(
      `tolgee-discover: GET ${url} → HTTP ${res.status} — ${json?.code || json?.message || text.slice(0, 200)}`,
    );
    process.exit(1);
  }
  const id = json.id ?? projectId;
  const name = json.name ?? json.slug ?? '(project)';
  console.log(`tolgee-discover: API base ${base}`);
  console.log(`Resolved project from TOLGEE_PROJECT_ID:\n`);
  console.log(`  id=${id}\tname=${name}${json.slug ? `\tslug=${json.slug}` : ''}`);
  console.log('\nAlready configured:');
  console.log(`  TOLGEE_API_URL=${base}`);
  console.log(`  TOLGEE_PROJECT_ID=${id}`);
}

function pickProjects(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.content)) return json.content;
  if (json && Array.isArray(json._embedded?.projects)) return json._embedded.projects;
  if (json && Array.isArray(json.projects)) return json.projects;
  return null;
}

async function main() {
  loadTolgeeEnv();

  const apiKey = process.env.TOLGEE_API_KEY?.trim();
  const base = trimSlash(process.env.TOLGEE_API_URL?.trim() || DEFAULT_API);
  const argvId = process.argv.slice(2).find((a) => /^\d+$/.test(a));

  if (!apiKey) {
    console.error('tolgee-discover: set TOLGEE_API_KEY in env.config or .env.local');
    process.exit(1);
  }

  if (argvId) {
    await trySingleProject(base, apiKey, argvId);
    return;
  }

  const url = `${base}/v2/projects`;
  const res = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error(`tolgee-discover: non-JSON response (${res.status})`);
    process.exit(1);
  }

  if (!res.ok) {
    const msg = json?.message || json?.code || text.slice(0, 200);
    const projectId = process.env.TOLGEE_PROJECT_ID?.trim();
    if ((res.status === 403 || res.status === 401) && projectId) {
      await trySingleProject(base, apiKey, projectId);
      return;
    }
    console.error(`tolgee-discover: HTTP ${res.status} — ${msg}`);
    console.error(
      '  Hint: project-scoped API keys often cannot list all projects (403). Use a PAT, or copy the numeric project id from the Tolgee URL …/projects/{id}/… and set TOLGEE_PROJECT_ID, then re-run.',
    );
    process.exit(1);
  }

  const projects = pickProjects(json);
  if (!projects) {
    console.error('tolgee-discover: unexpected response shape (no project list).');
    console.error(JSON.stringify(json, null, 2).slice(0, 500));
    process.exit(1);
  }

  console.log(`tolgee-discover: API base ${base}`);
  console.log(`Found ${projects.length} project(s):\n`);
  for (const p of projects) {
    const id = p.id ?? p.projectId;
    const name = p.name ?? p.slug ?? '(unnamed)';
    const slug = p.slug ?? '';
    console.log(`  id=${id}\tname=${name}${slug ? `\tslug=${slug}` : ''}`);
  }
  console.log('\nSet in env.config (then pnpm env:sync):');
  console.log(`  TOLGEE_API_URL=${base}`);
  console.log('  TOLGEE_PROJECT_ID=<id from above>');
  console.log('  TOLGEE_API_KEY=<your existing key>');
}

main().catch((e) => {
  console.error(`tolgee-discover failed: ${e.message}`);
  process.exit(1);
});
