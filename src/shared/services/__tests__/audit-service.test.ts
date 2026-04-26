/**
 * Tests for Audit Service
 */

// Type for headers result
interface MockHeaders {
  get: (name: string) => string | null;
}

// Create typed mock function
const { mockHeadersFn } = vi.hoisted(() => ({
  mockHeadersFn: vi.fn<() => Promise<MockHeaders>>(),
}));

// Mock dependencies before importing the module
vi.mock('next/headers', () => ({
  headers: mockHeadersFn,
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}));

vi.mock('@/shared/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
  },
}));

vi.mock('@/shared/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { db } from '@/shared/db';

import { AuditActions, getCorrelationIds, logAuditEvent } from '../audit-service';

const mockDb = db as Mocked<typeof db>;

describe('audit-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCorrelationIds', () => {
    it('should return IDs from headers if present', async () => {
      const mockHeadersList: MockHeaders = {
        get: vi.fn((name: string) => {
          if (name === 'x-request-id') return 'req-from-header';
          if (name === 'x-trace-id') return 'trace-from-header';
          return null;
        }),
      };
      mockHeadersFn.mockResolvedValue(mockHeadersList);

      const result = await getCorrelationIds();

      expect(result).toEqual({
        requestId: 'req-from-header',
        traceId: 'trace-from-header',
      });
    });

    it('should generate UUIDs when headers are missing', async () => {
      const mockHeadersList: MockHeaders = {
        get: vi.fn(() => null),
      };
      mockHeadersFn.mockResolvedValue(mockHeadersList);

      const result = await getCorrelationIds();

      expect(result).toEqual({
        requestId: 'mock-uuid-123',
        traceId: 'mock-uuid-123',
      });
    });
  });

  describe('logAuditEvent', () => {
    it('should insert audit event and return ID', async () => {
      const mockHeadersList: MockHeaders = {
        get: vi.fn((name: string) => {
          if (name === 'x-forwarded-for') return '192.168.1.1';
          if (name === 'user-agent') return 'Mozilla/5.0';
          return null;
        }),
      };
      mockHeadersFn.mockResolvedValue(mockHeadersList);

      const mockValues = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: 'audit-123' }]);

      (mockDb.insert as Mock).mockReturnValue({
        values: mockValues.mockReturnValue({
          returning: mockReturning,
        }),
      });

      const result = await logAuditEvent({
        tenantId: 'tenant-123',
        actorId: 'user-123',
        action: 'person.created',
        entityType: 'person',
        entityId: 'person-456',
        changes: { name: 'John Doe' },
      });

      expect(result).toBe('audit-123');
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should include AI context when provided', async () => {
      const mockHeadersList: MockHeaders = {
        get: vi.fn(() => null),
      };
      mockHeadersFn.mockResolvedValue(mockHeadersList);

      const mockValues = vi.fn().mockReturnThis();
      const mockReturning = vi.fn().mockResolvedValue([{ id: 'audit-123' }]);

      (mockDb.insert as Mock).mockReturnValue({
        values: mockValues.mockReturnValue({
          returning: mockReturning,
        }),
      });

      await logAuditEvent({
        action: 'ai.conversation',
        entityType: 'conversation',
        aiModelVersion: 'gpt-4o-mini',
        aiPromptVersion: 'v1.2',
      });

      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          aiModelVersion: 'gpt-4o-mini',
          aiPromptVersion: 'v1.2',
        }),
      );
    });
  });

  describe('AuditActions', () => {
    it('should have person actions', () => {
      expect(AuditActions.PERSON_CREATED).toBe('person.created');
      expect(AuditActions.PERSON_UPDATED).toBe('person.updated');
      expect(AuditActions.PERSON_DELETED).toBe('person.deleted');
    });

    it('should have file actions', () => {
      expect(AuditActions.FILE_UPLOADED).toBe('file.uploaded');
      expect(AuditActions.FILE_DELETED).toBe('file.deleted');
    });

    it('should have AI actions', () => {
      expect(AuditActions.AI_CONVERSATION).toBe('ai.conversation');
    });

    it('should have integration actions', () => {
      expect(AuditActions.INTEGRATION_SYNC_COMPLETED).toBe('integration.sync_completed');
      expect(AuditActions.INTEGRATION_SYNC_FAILED).toBe('integration.sync_failed');
    });

    it('should have auth actions', () => {
      expect(AuditActions.AUTH_LOGIN).toBe('auth.login');
      expect(AuditActions.AUTH_LOGOUT).toBe('auth.logout');
    });
  });
});
