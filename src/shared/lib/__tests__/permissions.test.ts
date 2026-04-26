/**
 * Tests for permissions utilities
 */

import { db } from '@/shared/db';
import {
  type AuthResult,
  createMockSession,
  createMockTenant,
  createNullAuthResult,
  type MockTenant,
} from '@tests/support/mock-factories';

// Create typed mock functions
const { mockAuthFn, mockGetTenantBySlugFn } = vi.hoisted(() => ({
  mockAuthFn: vi.fn<() => Promise<AuthResult>>(),
  mockGetTenantBySlugFn: vi.fn<(tenantSlug: string) => Promise<MockTenant | undefined>>(),
}));

// Mock dependencies before importing the module
vi.mock('@/shared/db', () => ({
  db: {
    query: {
      tenantMemberships: { findFirst: vi.fn(), findMany: vi.fn() },
      tenantMembershipRoles: { findMany: vi.fn() },
      rolePermissions: { findMany: vi.fn() },
      permissions: { findMany: vi.fn() },
      roles: { findMany: vi.fn() },
    },
  },
}));

vi.mock('@/shared/lib/auth', () => ({
  auth: mockAuthFn,
}));

vi.mock('@/shared/lib/tenant', () => ({
  getTenantBySlug: mockGetTenantBySlugFn,
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import {
  getAllTenantPermissionsForUser,
  getCurrentRoleIds,
  getCurrentRoles,
  getCurrentUserPermissions,
  hasPermission,
  requirePermission,
} from '../permissions';

const mockDb = db as Mocked<typeof db>;

describe('permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasPermission', () => {
    it('should return false when not authenticated', async () => {
      mockAuthFn.mockResolvedValue(createNullAuthResult());

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(false);
    });

    it('should return false when tenant does not exist', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(undefined);

      const result = await hasPermission('non-existent', 'admin:settings');

      expect(result).toBe(false);
    });

    it('should return false when user has no membership', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue(null);

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(false);
    });

    it('should return false when user has no roles', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([]);

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(false);
    });

    it('should return true when user has the permission', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-123' }]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([{ permissionId: 'perm-123' }]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([{ key: 'admin:settings' }]);

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(true);
    });

    it('should return false when user lacks the specific permission', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-123' }]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([{ permissionId: 'perm-123' }]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([{ key: 'profile:read' }]);

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(false);
    });

    it('should return false when role has no permissions', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-123' }]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([]);

      const result = await hasPermission('test-tenant', 'admin:settings');

      expect(result).toBe(false);
    });
  });

  describe('requirePermission', () => {
    it('should redirect to login when not authenticated', async () => {
      mockAuthFn.mockResolvedValue(createNullAuthResult());

      await expect(requirePermission('test-tenant', 'admin:settings')).rejects.toThrow('REDIRECT:/login');
    });

    it('should redirect to login when user has no email', async () => {
      mockAuthFn.mockResolvedValue(createMockSession({ user: { email: null } }));

      await expect(requirePermission('test-tenant', 'admin:settings')).rejects.toThrow('REDIRECT:/login');
    });

    it('should redirect to tenant with error when unauthorized', async () => {
      mockAuthFn.mockResolvedValue(createMockSession({ user: { email: 'test@example.com' } }));
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue(null);

      await expect(requirePermission('test-tenant', 'admin:settings')).rejects.toThrow(
        'REDIRECT:/t/test-tenant?error=unauthorized',
      );
    });

    it('should return user info when authorized', async () => {
      mockAuthFn.mockResolvedValue(createMockSession({ user: { email: 'test@example.com' } }));
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-123' }]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([{ permissionId: 'perm-123' }]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([{ key: 'admin:settings' }]);

      const result = await requirePermission('test-tenant', 'admin:settings');

      expect(result).toEqual({ userId: 'user-123', email: 'test@example.com' });
    });
  });

  describe('getCurrentRoleIds', () => {
    it('should return empty array when not authenticated', async () => {
      mockAuthFn.mockResolvedValue(createNullAuthResult());

      const result = await getCurrentRoleIds('test-tenant');

      expect(result).toEqual([]);
    });

    it('should return empty array when tenant does not exist', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(undefined);

      const result = await getCurrentRoleIds('test-tenant');

      expect(result).toEqual([]);
    });

    it('should return empty array when no membership', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue(null);

      const result = await getCurrentRoleIds('test-tenant');

      expect(result).toEqual([]);
    });

    it('should return role IDs', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([
        { roleId: 'role-1' },
        { roleId: 'role-2' },
      ]);

      const result = await getCurrentRoleIds('test-tenant');

      expect(result).toEqual(['role-1', 'role-2']);
    });
  });

  describe('getCurrentRoles', () => {
    it('should return empty array when no role IDs', async () => {
      mockAuthFn.mockResolvedValue(createNullAuthResult());

      const result = await getCurrentRoles('test-tenant');

      expect(result).toEqual([]);
    });

    it('should return roles', async () => {
      mockAuthFn.mockResolvedValue(createMockSession());
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-1' }]);
      (mockDb.query.roles.findMany as Mock).mockResolvedValue([{ id: 'role-1', name: 'Admin' }]);

      const result = await getCurrentRoles('test-tenant');

      expect(result).toEqual([{ id: 'role-1', name: 'Admin' }]);
    });
  });

  describe('getCurrentUserPermissions', () => {
    it('should return empty array when not authenticated', async () => {
      mockAuthFn.mockResolvedValue(createNullAuthResult());

      const result = await getCurrentUserPermissions('test-tenant');

      expect(result).toEqual([]);
    });

    it('should return permissions from session if available', async () => {
      mockAuthFn.mockResolvedValue(
        createMockSession({
          user: {
            permissions: { 'test-tenant': ['admin:settings', 'profile:read'] },
          },
        }),
      );

      const result = await getCurrentUserPermissions('test-tenant');

      expect(result).toEqual(['admin:settings', 'profile:read']);
    });

    it('should fetch permissions from DB when not in session', async () => {
      mockAuthFn.mockResolvedValue(createMockSession({ user: { permissions: undefined } }));
      mockGetTenantBySlugFn.mockResolvedValue(createMockTenant());
      (mockDb.query.tenantMemberships.findFirst as Mock).mockResolvedValue({ id: 'membership-123' });
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([{ roleId: 'role-1' }]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([{ permissionId: 'perm-1' }]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([{ key: 'profile:read' }]);

      const result = await getCurrentUserPermissions('test-tenant');

      expect(result).toEqual(['profile:read']);
    });
  });

  describe('getAllTenantPermissionsForUser', () => {
    it('should return empty object when user has no memberships', async () => {
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue([]);

      const result = await getAllTenantPermissionsForUser('user-123');

      expect(result).toEqual({});
    });

    it('should return empty arrays when roles have no permissions', async () => {
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue([
        { id: 'membership-1', tenant: { id: 'tenant-1', slug: 'tenant-1' } },
      ]);
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([]);

      const result = await getAllTenantPermissionsForUser('user-123');

      expect(result).toEqual({ 'tenant-1': [] });
    });

    it('should return permissions for all tenants', async () => {
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue([
        { id: 'membership-1', tenant: { id: 'tenant-1', slug: 'tenant-a' } },
        { id: 'membership-2', tenant: { id: 'tenant-2', slug: 'tenant-b' } },
      ]);
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([
        { membershipId: 'membership-1', roleId: 'role-1' },
        { membershipId: 'membership-2', roleId: 'role-2' },
      ]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([
        { roleId: 'role-1', permissionId: 'perm-1' },
        { roleId: 'role-2', permissionId: 'perm-2' },
      ]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([
        { id: 'perm-1', key: 'admin:settings', tenantId: null },
        { id: 'perm-2', key: 'profile:read', tenantId: 'tenant-2' },
      ]);

      const result = await getAllTenantPermissionsForUser('user-123');

      expect(result['tenant-a']).toContain('admin:settings');
      expect(result['tenant-b']).toContain('profile:read');
    });

    it('should handle user with multiple roles in same tenant', async () => {
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue([
        { id: 'membership-1', tenant: { id: 'tenant-1', slug: 'test-tenant' } },
      ]);
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([
        { membershipId: 'membership-1', roleId: 'role-1' },
        { membershipId: 'membership-1', roleId: 'role-2' },
      ]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([
        { roleId: 'role-1', permissionId: 'perm-1' },
        { roleId: 'role-2', permissionId: 'perm-2' },
      ]);
      (mockDb.query.permissions.findMany as Mock).mockResolvedValue([
        { id: 'perm-1', key: 'profile:read', tenantId: null },
        { id: 'perm-2', key: 'admin:settings', tenantId: null },
      ]);

      const result = await getAllTenantPermissionsForUser('user-123');

      expect(result['test-tenant']).toContain('profile:read');
      expect(result['test-tenant']).toContain('admin:settings');
    });

    it('should return empty array for memberships with no role permissions', async () => {
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue([
        { id: 'membership-1', tenant: { id: 'tenant-1', slug: 'test-tenant' } },
      ]);
      (mockDb.query.tenantMembershipRoles.findMany as Mock).mockResolvedValue([
        { membershipId: 'membership-1', roleId: 'role-1' },
      ]);
      (mockDb.query.rolePermissions.findMany as Mock).mockResolvedValue([]);

      const result = await getAllTenantPermissionsForUser('user-123');

      expect(result['test-tenant']).toEqual([]);
    });
  });
});
