vi.mock('@/shared/db', () => ({ db: { query: { tenants: { findFirst: vi.fn() } } } }));

/**
 * Tests for tenant utilities
 */

import { buildTenantPath, extractTenantSlug } from '../tenant';

// Note: getCurrentTenantSlug, getCurrentTenant, getTenantBySlug, and validateTenantSlug
// are async functions that depend on Next.js headers and database.
// They should be tested in integration tests or with more complex mocking.

describe('tenant', () => {
  describe('buildTenantPath', () => {
    it('should build path with leading slash', () => {
      expect(buildTenantPath('afenda', '/dashboard')).toBe('/t/afenda/dashboard');
    });

    it('should build path without leading slash', () => {
      expect(buildTenantPath('afenda', 'settings')).toBe('/t/afenda/settings');
    });

    it('should handle empty path', () => {
      expect(buildTenantPath('afenda', '')).toBe('/t/afenda/');
    });

    it('should handle root path', () => {
      expect(buildTenantPath('afenda', '/')).toBe('/t/afenda/');
    });

    it('should handle nested paths', () => {
      expect(buildTenantPath('afenda', '/admin/settings/features')).toBe('/t/afenda/admin/settings/features');
    });

    it('should handle path with query params', () => {
      expect(buildTenantPath('afenda', '/search?q=test')).toBe('/t/afenda/search?q=test');
    });
  });

  describe('extractTenantSlug', () => {
    it('should extract slug from tenant path', () => {
      expect(extractTenantSlug('/t/afenda/dashboard')).toBe('afenda');
    });

    it('should extract slug from path without subpath', () => {
      expect(extractTenantSlug('/t/afenda')).toBe('afenda');
    });

    it('should extract slug from path with trailing slash', () => {
      expect(extractTenantSlug('/t/afenda/')).toBe('afenda');
    });

    it('should return null for non-tenant paths', () => {
      expect(extractTenantSlug('/about')).toBeNull();
      expect(extractTenantSlug('/login')).toBeNull();
      expect(extractTenantSlug('/')).toBeNull();
    });

    it('should return null for paths that partially match', () => {
      expect(extractTenantSlug('/tenant/afenda')).toBeNull();
      expect(extractTenantSlug('/api/t/afenda')).toBeNull();
    });

    it('should handle slugs with hyphens', () => {
      expect(extractTenantSlug('/t/my-company/dashboard')).toBe('my-company');
    });

    it('should handle slugs with underscores', () => {
      expect(extractTenantSlug('/t/my_company/dashboard')).toBe('my_company');
    });

    it('should handle numeric slugs', () => {
      expect(extractTenantSlug('/t/123/dashboard')).toBe('123');
    });
  });
});
