import { describe, expect, it } from 'vitest';

import {
  assertValidOrganizationSlug,
  isReservedOrganizationSlug,
  normalizeOrganizationSlug,
} from '../organization-slug';

describe('normalizeOrganizationSlug', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(normalizeOrganizationSlug('  My Company Name  ')).toBe('my-company-name');
  });

  it('strips invalid characters', () => {
    expect(normalizeOrganizationSlug('Afenda™ (EU)')).toBe('afenda-eu');
  });
});

describe('isReservedOrganizationSlug', () => {
  it('flags reserved labels', () => {
    expect(isReservedOrganizationSlug('api')).toBe(true);
    expect(isReservedOrganizationSlug('afenda')).toBe(false);
  });
});

describe('assertValidOrganizationSlug', () => {
  it('accepts valid slugs', () => {
    expect(assertValidOrganizationSlug('afenda-corp')).toBeNull();
  });

  it('rejects too short', () => {
    expect(assertValidOrganizationSlug('a')).toMatch(/2 and 100/);
  });

  it('rejects reserved slugs', () => {
    expect(assertValidOrganizationSlug('admin')).toMatch(/reserved/i);
  });
});
