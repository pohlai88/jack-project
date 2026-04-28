import { describe, expect, it } from 'vitest';

import { getPostgresConstraintName, getPostgresErrorCode, isPostgresUniqueViolation } from '../postgres-errors';

describe('postgres-errors', () => {
  it('reads code and constraint from a flat pg-style error', () => {
    const err = { code: '23505', constraint: 'tenants_slug_unique' };
    expect(getPostgresErrorCode(err)).toBe('23505');
    expect(getPostgresConstraintName(err)).toBe('tenants_slug_unique');
    expect(isPostgresUniqueViolation(err)).toBe(true);
  });

  it('walks cause chain', () => {
    const inner = { code: '23505', constraint: 'tenant_memberships_user_tenant_idx' };
    const err = { name: 'DrizzleQueryError', cause: inner };
    expect(isPostgresUniqueViolation(err)).toBe(true);
    expect(getPostgresConstraintName(err)).toBe('tenant_memberships_user_tenant_idx');
  });

  it('returns false for non-unique errors', () => {
    expect(isPostgresUniqueViolation({ code: '42P01' })).toBe(false);
  });
});
