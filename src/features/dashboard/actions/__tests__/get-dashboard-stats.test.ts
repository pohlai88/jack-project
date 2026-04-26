/**
 * Tests for getDashboardStats server action
 */

import { db as mockDb } from '@/shared/db';
import { type AuthResult, createMockSession, createNullAuthResult } from '@tests/support/mock-factories';

const { mockAuthFn } = vi.hoisted(() => ({
  mockAuthFn: vi.fn<() => Promise<AuthResult>>(),
}));

vi.mock('@/shared/db', () => ({
  db: {
    query: {
      auditEvents: { findMany: vi.fn() },
    },
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  },
}));

vi.mock('@/shared/lib/auth', () => ({
  auth: mockAuthFn,
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

import { getDashboardStats } from '../get-dashboard-stats';

describe('getDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error when user is not authenticated', async () => {
    mockAuthFn.mockResolvedValue(createNullAuthResult());

    const result = await getDashboardStats('tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not authenticated');
  });

  it('should return dashboard stats for authenticated user', async () => {
    mockAuthFn.mockResolvedValue(createMockSession());

    (mockDb.select as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ count: 5 }]),
      }),
    });

    (mockDb.query.auditEvents.findMany as Mock).mockResolvedValue([
      {
        id: 'event-1',
        action: 'member.created',
        entityType: 'person',
        entityId: 'person-1',
        timestamp: new Date(),
        metadata: null,
      },
    ]);

    const result = await getDashboardStats('tenant-123');

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data).toBeDefined();
      expect(result.data.teamSize).toBeDefined();
      expect(result.data.recentActivity).toBeDefined();
    }
  });

  it('should handle errors gracefully', async () => {
    mockAuthFn.mockRejectedValue(new Error('Database error'));

    const result = await getDashboardStats('tenant-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch dashboard stats');
  });
});
