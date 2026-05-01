/**
 * Demo Seed Script
 *
 * Seeds deterministic tenants, users, memberships, roles, permissions, and
 * invitation fixtures for local development and E2E auth coverage.
 * Run with: pnpm db:seed
 */

import { and, eq } from 'drizzle-orm';

import { db } from '../src/shared/db';
import * as schema from '../src/shared/db/schema';
import type { TenantRole } from '../src/shared/db/schema/auth';

const TENANTS = {
  primary: { name: 'Afenda', slug: 'afenda' },
  secondary: { name: 'Nexus Canon', slug: 'nexus-canon' },
} as const;

const PERMISSIONS = [
  { key: 'admin:dashboard', name: 'Admin dashboard', category: 'admin' },
  { key: 'admin:integrations', name: 'Manage integrations', category: 'admin' },
  { key: 'admin:members', name: 'Manage members', category: 'admin' },
  { key: 'admin:invites', name: 'Manage invites', category: 'admin' },
  { key: 'admin:settings', name: 'Manage settings', category: 'admin' },
  { key: 'profile:read', name: 'Read profile', category: 'profile' },
] as const;

const USERS = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    memberships: [{ tenantSlug: TENANTS.primary.slug, role: 'admin', roleSlug: 'admin' }],
  },
  {
    email: 'member@example.com',
    name: 'Member User',
    firstName: 'Member',
    lastName: 'User',
    memberships: [{ tenantSlug: TENANTS.primary.slug, role: 'member', roleSlug: 'member' }],
  },
  {
    email: 'member_new@example.com',
    name: 'Fresh Member',
    firstName: 'Fresh',
    lastName: 'Member',
    memberships: [{ tenantSlug: TENANTS.primary.slug, role: 'member', roleSlug: 'member' }],
  },
  {
    email: 'multi@example.com',
    name: 'Multi Tenant User',
    firstName: 'Multi',
    lastName: 'Tenant',
    memberships: [
      { tenantSlug: TENANTS.primary.slug, role: 'member', roleSlug: 'member' },
      { tenantSlug: TENANTS.secondary.slug, role: 'member', roleSlug: 'member' },
    ],
  },
  {
    email: 'nomember@example.com',
    name: 'No Membership User',
    firstName: 'No',
    lastName: 'Membership',
    memberships: [],
  },
  {
    email: 'invitee@example.com',
    name: 'Invited User',
    firstName: 'Invited',
    lastName: 'User',
    memberships: [],
  },
  {
    email: 'wrong@example.com',
    name: 'Wrong Email User',
    firstName: 'Wrong',
    lastName: 'Email',
    memberships: [],
  },
] as const satisfies ReadonlyArray<{
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  memberships: ReadonlyArray<{
    tenantSlug: string;
    role: TenantRole;
    roleSlug: 'admin' | 'member';
  }>;
}>;

const INVITES = [
  {
    token: 'invite-active-afenda-token',
    tenantSlug: TENANTS.primary.slug,
    email: 'invitee@example.com',
    firstName: 'Invited',
    lastName: 'User',
    status: 'pending',
    role: 'member',
    expiresAt: daysFromNow(7),
    message: 'Welcome to Afenda.',
  },
  {
    token: 'invite-mismatch-afenda-token',
    tenantSlug: TENANTS.primary.slug,
    email: 'invitee@example.com',
    firstName: 'Invited',
    lastName: 'User',
    status: 'pending',
    role: 'member',
    expiresAt: daysFromNow(7),
    message: 'Use this invite to verify email mismatch handling.',
  },
  {
    token: 'invite-member-afenda-token',
    tenantSlug: TENANTS.primary.slug,
    email: 'member@example.com',
    firstName: 'Member',
    lastName: 'User',
    status: 'pending',
    role: 'member',
    expiresAt: daysFromNow(7),
    message: 'Re-accept invite for coverage.',
  },
  {
    token: 'invite-expired-afenda-token',
    tenantSlug: TENANTS.primary.slug,
    email: 'expired@example.com',
    firstName: 'Expired',
    lastName: 'Invite',
    status: 'pending',
    role: 'member',
    expiresAt: daysFromNow(-2),
    message: 'This invitation should be expired.',
  },
  {
    token: 'invite-revoked-afenda-token',
    tenantSlug: TENANTS.primary.slug,
    email: 'revoked@example.com',
    firstName: 'Revoked',
    lastName: 'Invite',
    status: 'revoked',
    role: 'member',
    expiresAt: daysFromNow(7),
    message: 'This invitation should be revoked.',
  },
] as const;

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function ensureTenant(tenantInput: { name: string; slug: string }) {
  const existing = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, tenantInput.slug),
  });

  if (existing) return existing;

  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      name: tenantInput.name,
      slug: tenantInput.slug,
      settings: null,
    })
    .returning();

  return tenant;
}

async function ensureRole(tenantId: string, role: { name: string; slug: 'admin' | 'member'; description: string }) {
  const existing = await db.query.roles.findFirst({
    where: and(eq(schema.roles.tenantId, tenantId), eq(schema.roles.slug, role.slug)),
  });

  if (existing) return existing;

  const [created] = await db
    .insert(schema.roles)
    .values({
      tenantId,
      name: role.name,
      slug: role.slug,
      description: role.description,
      isSystem: true,
    })
    .returning();

  return created;
}

async function ensurePermission(tenantId: string, permission: (typeof PERMISSIONS)[number]) {
  const existing = await db.query.permissions.findFirst({
    where: and(eq(schema.permissions.tenantId, tenantId), eq(schema.permissions.key, permission.key)),
  });

  if (existing) return existing;

  const [created] = await db
    .insert(schema.permissions)
    .values({
      tenantId,
      key: permission.key,
      name: permission.name,
      category: permission.category,
    })
    .returning();

  return created;
}

async function ensureRolePermission(roleId: string, permissionId: string) {
  const existing = await db.query.rolePermissions.findFirst({
    where: and(eq(schema.rolePermissions.roleId, roleId), eq(schema.rolePermissions.permissionId, permissionId)),
  });

  if (!existing) {
    await db.insert(schema.rolePermissions).values({ roleId, permissionId });
  }
}

async function ensureUser(userInput: (typeof USERS)[number]) {
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, userInput.email),
  });

  if (existing) return existing;

  const [created] = await db
    .insert(schema.users)
    .values({
      email: userInput.email,
      name: userInput.name,
    })
    .returning();

  return created;
}

async function ensurePerson(input: {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}) {
  const existing = await db.query.persons.findFirst({
    where: and(eq(schema.persons.tenantId, input.tenantId), eq(schema.persons.email, input.email)),
  });

  if (existing) return existing;

  const [created] = await db
    .insert(schema.persons)
    .values({
      tenantId: input.tenantId,
      email: input.email,
      workEmail: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: input.displayName,
      status: 'active',
      profileInitialized: true,
    })
    .returning();

  return created;
}

async function ensureMembership(input: {
  userId: string;
  tenantId: string;
  personId: string;
  role: TenantRole;
  roleId: string;
}) {
  const existing = await db.query.tenantMemberships.findFirst({
    where: and(
      eq(schema.tenantMemberships.userId, input.userId),
      eq(schema.tenantMemberships.tenantId, input.tenantId),
    ),
  });

  const membership =
    existing ??
    (
      await db
        .insert(schema.tenantMemberships)
        .values({
          userId: input.userId,
          tenantId: input.tenantId,
          personId: input.personId,
          role: input.role,
          primaryRoleId: input.roleId,
        })
        .returning()
    )[0];

  const roleLink = await db.query.tenantMembershipRoles.findFirst({
    where: and(
      eq(schema.tenantMembershipRoles.membershipId, membership.id),
      eq(schema.tenantMembershipRoles.roleId, input.roleId),
    ),
  });

  if (!roleLink) {
    await db.insert(schema.tenantMembershipRoles).values({
      membershipId: membership.id,
      roleId: input.roleId,
    });
  }
}

async function resetUserWorkspaceState(userId: string, email: string) {
  const memberships = await db.query.tenantMemberships.findMany({
    where: eq(schema.tenantMemberships.userId, userId),
    columns: { id: true },
  });

  for (const membership of memberships) {
    await db.delete(schema.tenantMembershipRoles).where(eq(schema.tenantMembershipRoles.membershipId, membership.id));
  }

  await db.delete(schema.tenantMemberships).where(eq(schema.tenantMemberships.userId, userId));
  await db.delete(schema.persons).where(eq(schema.persons.email, email));
}

async function ensureInvite(input: {
  tenantId: string;
  roleId: string | null;
  invitedByUserId: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  status: 'pending' | 'revoked';
  role: TenantRole;
  expiresAt: Date;
}) {
  const existingByToken = await db.query.tenantInvitations.findFirst({
    where: eq(schema.tenantInvitations.token, input.token),
  });
  const existing = existingByToken;

  const values = {
    tenantId: input.tenantId,
    email: input.email,
    token: input.token,
    role: input.role,
    roleId: input.roleId,
    status: input.status,
    invitedByUserId: input.invitedByUserId,
    message: input.message,
    firstName: input.firstName,
    lastName: input.lastName,
    expiresAt: input.expiresAt,
    acceptedAt: null,
    acceptedByUserId: null,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(schema.tenantInvitations).set(values).where(eq(schema.tenantInvitations.id, existing.id));
    return;
  }

  await db.insert(schema.tenantInvitations).values(values);
}

async function main() {
  console.log('Seeding Afenda local development auth fixtures...');

  const tenants = new Map<string, Awaited<ReturnType<typeof ensureTenant>>>();
  for (const tenantInput of Object.values(TENANTS)) {
    const tenant = await ensureTenant(tenantInput);
    tenants.set(tenant.slug, tenant);
  }

  const rolesByTenant = new Map<string, Map<'admin' | 'member', Awaited<ReturnType<typeof ensureRole>>>>();

  for (const tenant of tenants.values()) {
    const adminRole = await ensureRole(tenant.id, {
      name: 'Admin',
      slug: 'admin',
      description: 'Full administrative access',
    });
    const memberRole = await ensureRole(tenant.id, {
      name: 'Member',
      slug: 'member',
      description: 'Standard member access',
    });

    rolesByTenant.set(
      tenant.slug,
      new Map([
        ['admin', adminRole],
        ['member', memberRole],
      ]),
    );

    const permissions = await Promise.all(PERMISSIONS.map((permission) => ensurePermission(tenant.id, permission)));
    for (const permission of permissions) {
      await ensureRolePermission(adminRole.id, permission.id);
      if (permission.key === 'profile:read') {
        await ensureRolePermission(memberRole.id, permission.id);
      }
    }
  }

  const usersByEmail = new Map<string, Awaited<ReturnType<typeof ensureUser>>>();

  for (const userInput of USERS) {
    const user = await ensureUser(userInput);
    usersByEmail.set(user.email ?? userInput.email, user);

    if (userInput.memberships.length === 0) {
      await resetUserWorkspaceState(user.id, userInput.email);
      continue;
    }

    for (const membershipInput of userInput.memberships) {
      const tenant = tenants.get(membershipInput.tenantSlug);
      const roles = rolesByTenant.get(membershipInput.tenantSlug);
      const role = roles?.get(membershipInput.roleSlug);

      if (!tenant || !role) {
        throw new Error(`Missing tenant or role for ${userInput.email} in ${membershipInput.tenantSlug}`);
      }

      const person = await ensurePerson({
        tenantId: tenant.id,
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        displayName: userInput.name,
      });

      await ensureMembership({
        userId: user.id,
        tenantId: tenant.id,
        personId: person.id,
        role: membershipInput.role,
        roleId: role.id,
      });
    }
  }

  const inviter = usersByEmail.get('admin@example.com');
  if (!inviter) {
    throw new Error('Expected seeded admin user to exist before creating invitations.');
  }

  for (const inviteInput of INVITES) {
    const tenant = tenants.get(inviteInput.tenantSlug);
    const role = rolesByTenant.get(inviteInput.tenantSlug)?.get('member');

    if (!tenant || !role) {
      throw new Error(`Missing tenant or member role for invite ${inviteInput.token}`);
    }

    await ensureInvite({
      tenantId: tenant.id,
      roleId: role.id,
      invitedByUserId: inviter.id,
      token: inviteInput.token,
      email: inviteInput.email,
      firstName: inviteInput.firstName,
      lastName: inviteInput.lastName,
      message: inviteInput.message,
      status: inviteInput.status,
      role: inviteInput.role,
      expiresAt: inviteInput.expiresAt,
    });
  }

  console.log(`Created or verified tenants: ${TENANTS.primary.slug}, ${TENANTS.secondary.slug}`);
  console.log(
    'Created or verified users: admin@example.com, member@example.com, member_new@example.com, multi@example.com, nomember@example.com, invitee@example.com, wrong@example.com',
  );
  console.log(
    'Seeded invite tokens: invite-active-afenda-token, invite-mismatch-afenda-token, invite-member-afenda-token, invite-expired-afenda-token, invite-revoked-afenda-token',
  );
  console.log('Primary login: http://localhost:3000/t/afenda/login');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
