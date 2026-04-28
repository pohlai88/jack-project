/**
 * Remove the registrable apex hostname from the Vercel project (e.g. nexuscanon.com)
 * while keeping www + wildcard tenant hosts. Reduces duplicate bindings and dashboard noise.
 *
 * Requires: VERCEL_TOKEN (https://vercel.com/account/tokens)
 *
 * Usage:
 *   VERCEL_TOKEN=... node scripts/remove-vercel-apex-domain.mjs
 *   pnpm vercel:domain:remove-apex
 *
 * Override defaults with VERCEL_PROJECT_NAME, VERCEL_TEAM_SLUG, VERCEL_REMOVE_APEX_DOMAIN.
 */

import { Vercel } from '@vercel/sdk';

const PROJECT = process.env.VERCEL_PROJECT_NAME ?? 'afenda-node';
const TEAM_SLUG = process.env.VERCEL_TEAM_SLUG ?? 'jacks-projects-7b3cfe94';
const APEX_DOMAIN = process.env.VERCEL_REMOVE_APEX_DOMAIN ?? 'nexuscanon.com';

const token = process.env.VERCEL_TOKEN;

if (!token?.trim()) {
  console.error(
    'Missing VERCEL_TOKEN. Create a token at https://vercel.com/account/tokens then run:\n  VERCEL_TOKEN=... pnpm vercel:domain:remove-apex',
  );
  process.exit(1);
}

const vercel = new Vercel({ bearerToken: token });

try {
  await vercel.projects.removeProjectDomain({
    idOrName: PROJECT,
    domain: APEX_DOMAIN,
    slug: TEAM_SLUG,
  });
  console.log(`Removed ${APEX_DOMAIN} from Vercel project ${PROJECT}.`);
  console.log(
    `Keep www + *.${APEX_DOMAIN} per architecture/governance/evidence/tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md`,
  );
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  if (/404|not\s*found|domain_not_found/i.test(msg)) {
    console.log(`Nothing to do: ${APEX_DOMAIN} is not on project ${PROJECT} (already removed).`);
    process.exit(0);
  }
  console.error('removeProjectDomain failed:', msg);
  process.exit(1);
}
