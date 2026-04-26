/**
 * Tests for Members Service
 */

// Type for requireTenantAdmin result
interface TenantAdminResult {
  userId: string;
  email: string;
  role: 'admin';
}

// Create typed mock function
const { mockRequireTenantAdminFn } = vi.hoisted(() => ({
  mockRequireTenantAdminFn: vi.fn<(tenantSlug: string) => Promise<TenantAdminResult | null>>(),
}));

// Mock dependencies before importing
vi.mock('@/shared/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
      tenantMemberships: { findFirst: vi.fn(), findMany: vi.fn() },
      users: { findFirst: vi.fn() },
      persons: { findFirst: vi.fn(), findMany: vi.fn() },
      roles: { findMany: vi.fn() },
      userRoles: { findMany: vi.fn() },
    },
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ total: 0 }]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn() },
}));

vi.mock('@/shared/lib/rbac', () => ({
  requireTenantAdmin: mockRequireTenantAdminFn,
}));

vi.mock('@/shared/lib/tenant', () => ({
  getTenantBySlug: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { db } from '@/shared/db';
import { listMembers } from '../members-service';

const mockDb = db as Mocked<typeof db>;

describe('members-service', () => {
  const mockAdminResult: TenantAdminResult = {
    userId: 'user-123',
    email: 'admin@example.com',
    role: 'admin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireTenantAdminFn.mockResolvedValue(mockAdminResult);
  });

  describe('listMembers', () => {
    it('should return error when not admin', async () => {
      mockRequireTenantAdminFn.mockResolvedValue(null);

      const result = await listMembers('test-tenant');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should return error when tenant not found', async () => {
      (mockDb.query.tenants.findFirst as Mock).mockResolvedValue(null);

      const result = await listMembers('non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tenant not found');
    });

    it('should return members with pagination', async () => {
      const mockTenant = { id: 'tenant-123' };
      const mockMemberships = [
        {
          id: 'mem-1',
          userId: 'user-1',
          tenantId: 'tenant-123',
          user: { id: 'user-1', name: 'John Doe', email: 'john@example.com', image: null },
          person: { id: 'person-1', firstName: 'John', lastName: 'Doe', title: 'Developer' },
        },
      ];

      (mockDb.query.tenants.findFirst as Mock).mockResolvedValue(mockTenant);
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue(mockMemberships);

      const result = await listMembers('test-tenant', { page: 1, pageSize: 10 });

      expect(result.success).toBe(true);
      expect(result.data?.items).toHaveLength(1);
    });

    it('should filter by search', async () => {
      const mockTenant = { id: 'tenant-123' };
      const mockMemberships = [
        {
          id: 'mem-1',
          userId: 'user-1',
          tenantId: 'tenant-123',
          user: { id: 'user-1', name: 'John Doe', email: 'john@example.com', image: null },
          person: { id: 'person-1', firstName: 'John', lastName: 'Doe', title: 'Developer' },
        },
        {
          id: 'mem-2',
          userId: 'user-2',
          tenantId: 'tenant-123',
          user: { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', image: null },
          person: { id: 'person-2', firstName: 'Jane', lastName: 'Smith', title: 'Designer' },
        },
      ];

      (mockDb.query.tenants.findFirst as Mock).mockResolvedValue(mockTenant);
      (mockDb.query.tenantMemberships.findMany as Mock).mockResolvedValue(mockMemberships);

      const result = await listMembers('test-tenant', { search: 'john' });

      expect(result.success).toBe(true);
      // Search filters on client-side
      expect(result.data?.items).toHaveLength(1);
    });
  });
});
