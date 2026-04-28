import { and, eq } from 'drizzle-orm';

import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';
import { env } from '@/shared/lib/env';
import { logger } from '@/shared/lib/logger';
import { getPostgresConstraintName, isPostgresUniqueViolation } from '@/shared/lib/postgres-errors';

import { assertValidOrganizationSlug, normalizeOrganizationSlug } from '../lib/organization-slug';

export type CreateOrganizationInput = {
  userId: string;
  email: string;
  userDisplayName: string | null | undefined;
  organizationName: string;
  organizationSlug: string;
};

export type CreateOrganizationResult = { ok: true; slug: string } | { ok: false; error: string };

function splitDisplayName(name: string | null | undefined): { firstName: string; lastName: string } {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { firstName: 'Owner', lastName: 'User' };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: 'User' };
  }
  return { firstName: parts[0]!, lastName: parts.slice(1).join(' ') || 'User' };
}

export async function createOrganizationForUser(input: CreateOrganizationInput): Promise<CreateOrganizationResult> {
  if (!env.ENABLE_SELF_SERVICE_TENANT_CREATE) {
    return { ok: false, error: 'Organization creation is not enabled.' };
  }

  const name = input.organizationName.trim();
  if (name.length < 2 || name.length > 255) {
    return { ok: false, error: 'Organization name must be between 2 and 255 characters.' };
  }

  const slug = normalizeOrganizationSlug(input.organizationSlug);
  const slugError = assertValidOrganizationSlug(slug);
  if (slugError) {
    return { ok: false, error: slugError };
  }

  const slugTaken = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, slug),
    columns: { id: true },
  });
  if (slugTaken) {
    return { ok: false, error: 'That organization URL is already taken.' };
  }

  try {
    const slugOut = await db.transaction(async (tx) => {
      const existingMembership = await tx.query.tenantMemberships.findFirst({
        where: eq(schema.tenantMemberships.userId, input.userId),
        columns: { id: true },
      });
      if (existingMembership) {
        throw new Error('ALREADY_MEMBER');
      }

      const [tenant] = await tx
        .insert(schema.tenants)
        .values({
          name,
          slug,
          settings: null,
        })
        .returning();

      if (!tenant) {
        throw new Error('TENANT_INSERT_FAILED');
      }

      await tx.insert(schema.roles).values([
        {
          tenantId: tenant.id,
          name: 'Admin',
          slug: 'admin',
          description: 'Full administrative access',
          isSystem: true,
        },
        {
          tenantId: tenant.id,
          name: 'Member',
          slug: 'member',
          description: 'Standard member access',
          isSystem: true,
        },
      ]);

      const adminRole = await tx.query.roles.findFirst({
        where: and(eq(schema.roles.tenantId, tenant.id), eq(schema.roles.slug, 'admin')),
        columns: { id: true },
      });
      if (!adminRole) {
        throw new Error('ADMIN_ROLE_MISSING');
      }

      const [membership] = await tx
        .insert(schema.tenantMemberships)
        .values({
          tenantId: tenant.id,
          userId: input.userId,
          role: 'admin',
          primaryRoleId: adminRole.id,
        })
        .returning();

      if (!membership) {
        throw new Error('MEMBERSHIP_INSERT_FAILED');
      }

      await tx.insert(schema.tenantMembershipRoles).values({
        membershipId: membership.id,
        roleId: adminRole.id,
      });

      const { firstName, lastName } = splitDisplayName(input.userDisplayName);

      await tx.insert(schema.persons).values({
        tenantId: tenant.id,
        email: input.email,
        firstName,
        lastName,
        status: 'onboarding',
        profileInitialized: false,
      });

      return tenant.slug;
    });

    return { ok: true, slug: slugOut };
  } catch (error) {
    if (error instanceof Error && error.message === 'ALREADY_MEMBER') {
      return { ok: false, error: 'You already belong to an organization.' };
    }
    if (isPostgresUniqueViolation(error)) {
      const constraint = getPostgresConstraintName(error);
      if (constraint === 'tenants_slug_unique' || constraint === 'tenants_subdomain_unique') {
        return { ok: false, error: 'That organization URL is already taken.' };
      }
      if (constraint === 'tenant_memberships_user_tenant_idx') {
        return { ok: false, error: 'You already belong to an organization.' };
      }
    }
    logger.error({ error }, 'createOrganizationForUser failed');
    return { ok: false, error: 'Could not create the organization. Try again later.' };
  }
}
