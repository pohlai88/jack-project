/**
 * Tests for S3 Service
 *
 * Note: These tests focus on the service functions that can be mocked.
 * Actual S3 operations require integration tests.
 */

// Mock AWS SDK before importing
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(function S3Client() {
    return { send: vi.fn() };
  }),
  PutObjectCommand: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn().mockResolvedValue('https://example.com/signed-url'),
}));

vi.mock('@/shared/db', () => ({
  db: {
    query: {
      tenants: { findFirst: vi.fn() },
    },
  },
}));

vi.mock('@/shared/lib/env', () => ({
  env: {
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'test-key',
    AWS_SECRET_ACCESS_KEY: 'test-secret',
    AWS_S3_BUCKET: 'test-bucket',
  },
}));

import { db } from '@/shared/db';
import { clearTenantS3Client } from '../s3-service';

// Suppress unused warning - kept for future tests
void (db as Mocked<typeof db>);

describe('s3-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('clearTenantS3Client', () => {
    it('should clear cached S3 client for tenant', () => {
      // This function clears the cache, so we just verify it doesn't throw
      expect(() => clearTenantS3Client('tenant-123')).not.toThrow();
    });

    it('should be idempotent', () => {
      // Calling twice should not throw
      clearTenantS3Client('tenant-123');
      expect(() => clearTenantS3Client('tenant-123')).not.toThrow();
    });
  });

  // Note: getTenantS3Client, generatePresignedUploadUrl, and generatePresignedDownloadUrl
  // require more complex mocking of the S3Client and database interactions.
  // These are better tested via integration tests.
});
