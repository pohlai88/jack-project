import { and, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

import { getTenantSettings, updateTenantSettings } from '@/features/admin';
import { GITHUB_PROVIDER_ID, GitHubClient } from '@/features/github';
import {
  appendIntegrationRunItem,
  finishIntegrationRun,
  startIntegrationRun,
  upsertIntegrationEntityLink,
} from '@/features/integration-sync';
import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';
import { auth } from '@/shared/lib/auth';
import { hasPermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';
import type { TenantSettings } from '@/shared/lib/tenant-settings';

type IntegrationSyncMode = 'migration_full' | 'sync_incremental' | 'reconcile' | 'dry_run';

const MODES = ['migration_full', 'sync_incremental', 'reconcile', 'dry_run'] as const;

function toPayloadHash(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export async function POST(request: NextRequest, context: { params: Promise<{ tenant: string }> }) {
  const { tenant: tenantSlug } = await context.params;
  const session = await auth();
  if (!session?.user?.id) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const allowed = await hasPermission(tenantSlug, 'admin:integrations');
  if (!allowed) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return new Response(JSON.stringify({ error: 'Tenant not found' }), { status: 404 });

  const membership = await db.query.tenantMemberships.findFirst({
    where: and(eq(schema.tenantMemberships.tenantId, tenant.id), eq(schema.tenantMemberships.userId, session.user.id)),
    columns: { personId: true },
  });
  const actorPersonId = membership?.personId;
  if (!actorPersonId)
    return new Response(JSON.stringify({ error: 'No person mapped for current user' }), { status: 400 });

  const account = await db.query.accounts.findFirst({
    where: and(eq(schema.accounts.userId, session.user.id), eq(schema.accounts.provider, GITHUB_PROVIDER_ID)),
    columns: { access_token: true },
  });
  if (!account?.access_token) {
    return new Response(JSON.stringify({ error: 'GitHub account is not connected' }), { status: 400 });
  }

  let body: { mode?: string } = {};
  try {
    body = (await request.json()) as { mode?: string };
  } catch {
    body = {};
  }

  const selectedMode =
    body.mode && MODES.includes(body.mode as IntegrationSyncMode)
      ? (body.mode as IntegrationSyncMode)
      : 'sync_incremental';
  const settings = await getTenantSettings(tenantSlug);
  const githubSettings = settings.integrations?.github;
  const client = new GitHubClient(account.access_token);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      let runId: string | undefined;
      try {
        const run = await startIntegrationRun({
          tenantId: tenant.id,
          triggeredByPersonId: actorPersonId,
          provider: 'github',
          mode: selectedMode,
          entities: [],
          scope: {},
        });
        runId = run.id;

        send({ type: 'progress', message: 'GitHub sync started' });

        const authenticatedUser = await client.getAuthenticatedUser();
        await appendIntegrationRunItem({
          tenantId: tenant.id,
          runId,
          provider: 'github',
          entityType: 'github_user',
          externalId: authenticatedUser.login,
          localEntityType: 'user',
          localEntityId: session.user.id,
          status: 'updated',
          payloadHash: toPayloadHash(authenticatedUser),
          diff: {
            login: authenticatedUser.login,
            email: authenticatedUser.email,
            htmlUrl: authenticatedUser.html_url,
          },
        });
        await upsertIntegrationEntityLink({
          tenantId: tenant.id,
          provider: 'github',
          entityType: 'github_user',
          externalId: authenticatedUser.login,
          localEntityType: 'user',
          localEntityId: session.user.id,
          syncHash: toPayloadHash(authenticatedUser),
          metadata: {
            providerAccountId: authenticatedUser.id,
            htmlUrl: authenticatedUser.html_url,
          },
        });

        let repositoriesSynced = 0;
        if (githubSettings?.syncRepositories ?? true) {
          const repos = githubSettings?.organizationFilter
            ? await client.listOrgRepos(githubSettings.organizationFilter, {
                type: githubSettings.includeForks ? 'all' : 'sources',
              })
            : await client.listUserRepos(undefined, { type: 'all' });

          for (const repo of repos) {
            if (!githubSettings?.includeArchived && repo.archived) continue;
            if (!githubSettings?.includeForks && repo.fork) continue;

            const payloadHash = toPayloadHash(repo);
            await appendIntegrationRunItem({
              tenantId: tenant.id,
              runId,
              provider: 'github',
              entityType: 'repository',
              externalId: String(repo.id),
              localEntityType: 'tenant',
              localEntityId: tenant.id,
              status: 'updated',
              payloadHash,
              diff: {
                name: repo.full_name,
                language: repo.language,
                private: repo.private,
                pushedAt: repo.pushed_at,
              },
            });
            await upsertIntegrationEntityLink({
              tenantId: tenant.id,
              provider: 'github',
              entityType: 'repository',
              externalId: String(repo.id),
              localEntityType: 'tenant',
              localEntityId: tenant.id,
              syncHash: payloadHash,
              externalUpdatedAt: repo.updated_at ? new Date(repo.updated_at) : null,
              metadata: {
                fullName: repo.full_name,
                url: repo.html_url,
                language: repo.language,
              },
            });
            repositoriesSynced += 1;
          }
          send({ type: 'progress', message: `Repositories synced: ${repositoriesSynced}` });
        }

        let peopleSynced = 0;
        const people = await db.query.persons.findMany({
          where: eq(schema.persons.tenantId, tenant.id),
          columns: {
            id: true,
            githubUsername: true,
          },
        });

        if (githubSettings?.syncContributions ?? true) {
          for (const person of people) {
            if (!person.githubUsername) continue;

            const summary = await client.getUserContributionSummary(person.githubUsername, {
              sinceDays: githubSettings?.contributionDaysLookback ?? 365,
            });
            const payloadHash = toPayloadHash(summary);

            await appendIntegrationRunItem({
              tenantId: tenant.id,
              runId,
              provider: 'github',
              entityType: 'contribution_summary',
              externalId: person.githubUsername,
              localEntityType: 'person',
              localEntityId: person.id,
              status: 'updated',
              payloadHash,
              diff: {
                totalCommits: summary.totalCommits,
                totalPRs: summary.totalPRs,
                totalIssues: summary.totalIssues,
                languages: Object.keys(summary.languages),
              },
            });
            await upsertIntegrationEntityLink({
              tenantId: tenant.id,
              provider: 'github',
              entityType: 'github_user',
              externalId: person.githubUsername,
              localEntityType: 'person',
              localEntityId: person.id,
              syncHash: payloadHash,
              metadata: {
                contributionSummary: summary,
              },
            });
            peopleSynced += 1;
          }
          send({ type: 'progress', message: `People contribution summaries synced: ${peopleSynced}` });
        }

        await updateTenantSettings(tenantSlug, {
          integrations: {
            ...settings.integrations,
            github: {
              ...githubSettings,
              lastSyncAt: new Date().toISOString(),
            },
          },
        } as Partial<TenantSettings>);

        await finishIntegrationRun({
          runId,
          tenantId: tenant.id,
          status: 'completed',
          actorId: actorPersonId,
          summary: {
            provider: 'github',
            mode: selectedMode,
            authenticatedUser: authenticatedUser.login,
            repositoriesSynced,
            peopleSynced,
          },
        });

        send({ type: 'result', success: true, message: 'Sync completed' });
        controller.close();
      } catch (error) {
        if (runId) {
          await finishIntegrationRun({
            runId,
            tenantId: tenant.id,
            status: 'failed',
            actorId: actorPersonId,
            summary: {
              provider: 'github',
              mode: selectedMode,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });
        }

        send({
          type: 'result',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
