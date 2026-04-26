/**
 * Tests for Department Service
 */

// Mock dependencies before importing
vi.mock('@/features/admin', () => ({
  getTenantSettings: vi.fn(),
  updateTenantSettings: vi.fn(),
}));

vi.mock('@/shared/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
      persons: { findMany: vi.fn() },
      departmentManagers: { findMany: vi.fn() },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
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

import { getTenantSettings, updateTenantSettings } from '@/features/admin';
import { db } from '@/shared/db';
import { getDepartments, getDepartmentsWithDetails } from '../department-service';

const mockGetTenantSettings = getTenantSettings as MockedFunction<typeof getTenantSettings>;
// Suppress unused warning - kept for future tests
void (updateTenantSettings as MockedFunction<typeof updateTenantSettings>);
const mockDb = db as Mocked<typeof db>;

describe('department-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDepartments', () => {
    it('should return departments from tenant settings', async () => {
      const mockDepartments = [
        { id: 'dept-1', name: 'Engineering', description: 'Engineering team' },
        { id: 'dept-2', name: 'Design', description: 'Design team' },
      ];
      mockGetTenantSettings.mockResolvedValue({
        departments: { list: mockDepartments },
      } as ReturnType<typeof getTenantSettings> extends Promise<infer T> ? T : never);

      const result = await getDepartments('test-tenant');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].name).toBe('Engineering');
    });

    it('should return empty array when no departments', async () => {
      mockGetTenantSettings.mockResolvedValue(
        {} as ReturnType<typeof getTenantSettings> extends Promise<infer T> ? T : never,
      );

      const result = await getDepartments('test-tenant');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      mockGetTenantSettings.mockRejectedValue(new Error('Settings error'));

      const result = await getDepartments('test-tenant');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to get departments');
    });
  });

  describe('getDepartmentsWithDetails', () => {
    it('should return error when tenant not found', async () => {
      (mockDb.query.tenants.findFirst as Mock).mockResolvedValue(null);

      const result = await getDepartmentsWithDetails('non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tenant not found');
    });

    it('should return departments with member counts', async () => {
      const mockTenant = { id: 'tenant-123', slug: 'test-tenant' };
      const mockDepartments = [
        { id: 'dept-1', name: 'Engineering' },
        { id: 'dept-2', name: 'Design' },
      ];
      const mockPersons = [
        { id: 'person-1', departmentId: 'dept-1' },
        { id: 'person-2', departmentId: 'dept-1' },
        { id: 'person-3', departmentId: 'dept-2' },
      ];
      const mockManagers = [{ departmentId: 'dept-1', managerId: 'person-1', isPrimary: true }];

      (mockDb.query.tenants.findFirst as Mock).mockResolvedValue(mockTenant);
      (mockDb.query.persons.findMany as Mock).mockResolvedValue(mockPersons);
      (mockDb.query.departmentManagers.findMany as Mock).mockResolvedValue(mockManagers);
      mockGetTenantSettings.mockResolvedValue({
        departments: { list: mockDepartments },
      } as ReturnType<typeof getTenantSettings> extends Promise<infer T> ? T : never);

      const result = await getDepartmentsWithDetails('test-tenant');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].memberCount).toBe(2);
      expect(result.data?.[1].memberCount).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      (mockDb.query.tenants.findFirst as Mock).mockRejectedValue(new Error('DB error'));

      const result = await getDepartmentsWithDetails('test-tenant');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to get departments with details');
    });
  });
});
