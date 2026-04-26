/**
 * Tests for Get Initial Data Action
 */

import { db } from '@/shared/db';
import { type AuthResult, createMockSession, createNullAuthResult } from '@tests/support/mock-factories';

interface MockTenantResult {
  id: string;
  slug: string;
  name: string;
}

const { mockAuthFn, mockGetTenantBySlugFn } = vi.hoisted(() => ({
  mockAuthFn: vi.fn<() => Promise<AuthResult>>(),
  mockGetTenantBySlugFn: vi.fn<(tenantSlug: string) => Promise<MockTenantResult | null>>(),
}));

vi.mock('@/shared/lib/auth', () => ({
  auth: mockAuthFn,
}));

vi.mock('@/shared/lib/tenant', () => ({
  getTenantBySlug: mockGetTenantBySlugFn,
}));

vi.mock('@/shared/db', () => ({
  db: {
    query: {
      persons: { findFirst: vi.fn() },
    },
  },
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

import { getInitialData } from '../get-initial-data';

const mockDb = db as Mocked<typeof db>;

describe('getInitialData', () => {
  const mockTenant = { id: 'tenant-123', slug: 'test-tenant', name: 'Test Tenant' };
  const mockPerson = { id: 'person-123', email: 'user@example.com', firstName: 'Test', lastName: 'User' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFn.mockResolvedValue(createMockSession({ user: { email: 'user@example.com', name: 'Test User' } }));
    mockGetTenantBySlugFn.mockResolvedValue(mockTenant);
    (mockDb.query.persons.findFirst as Mock).mockResolvedValue(mockPerson);
  });

  it('should throw error when not authenticated', async () => {
    mockAuthFn.mockResolvedValue(createNullAuthResult());
    await expect(getInitialData('test-tenant')).rejects.toThrow();
  });

  it('should throw error when user has no email', async () => {
    mockAuthFn.mockResolvedValue(createMockSession({ user: { email: null } }));
    await expect(getInitialData('test-tenant')).rejects.toThrow();
  });

  it('should throw error when tenant not found', async () => {
    mockGetTenantBySlugFn.mockResolvedValue(null);
    await expect(getInitialData('test-tenant')).rejects.toThrow();
  });

  it('should return initial data when person is found', async () => {
    const result = await getInitialData('test-tenant');

    expect(result).toBeDefined();
    expect(result.welcomeMessage).toBeDefined();
    expect(result.suggestedQuestions).toBeDefined();
    expect(result.capabilities).toHaveLength(3);
  });

  it('should include user name in welcome message', async () => {
    const result = await getInitialData('test-tenant');
    expect(result.welcomeMessage).toContain('Test User');
  });

  it('should return correct capabilities', async () => {
    const result = await getInitialData('test-tenant');
    const capabilityIds = result.capabilities.map((c) => c.id);
    expect(capabilityIds).toContain('automation');
    expect(capabilityIds).toContain('integrations');
    expect(capabilityIds).toContain('general');
  });
});
