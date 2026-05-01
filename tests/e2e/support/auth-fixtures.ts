export const locale = 'en';

export const tenants = {
  primary: 'afenda',
  secondary: 'nexus-canon',
} as const;

export const users = {
  admin: 'admin@example.com',
  member: 'member@example.com',
  memberFresh: 'member_new@example.com',
  multi: 'multi@example.com',
  tenantless: 'nomember@example.com',
  invitee: 'invitee@example.com',
  wrongEmail: 'wrong@example.com',
} as const;

export const inviteTokens = {
  active: 'invite-active-afenda-token',
  mismatch: 'invite-mismatch-afenda-token',
  alreadyMember: 'invite-member-afenda-token',
  expired: 'invite-expired-afenda-token',
  revoked: 'invite-revoked-afenda-token',
  invalid: 'invite-invalid-afenda-token',
} as const;

export const storageStates = {
  admin: 'tests/e2e/.auth/admin.json',
  member: 'tests/e2e/.auth/member.json',
  multi: 'tests/e2e/.auth/multi.json',
  tenantless: 'tests/e2e/.auth/tenantless.json',
  invitee: 'tests/e2e/.auth/invitee.json',
  wrongEmail: 'tests/e2e/.auth/wrong-email.json',
} as const;

export function tenantPath(tenant: string, suffix = ''): string {
  return `/${locale}/t/${tenant}${suffix}`;
}

export function loginPath(email?: string): string {
  return `/${locale}/login${email ? `?email=${encodeURIComponent(email)}` : ''}`;
}

export function tenantLoginPath(tenant: string, email?: string): string {
  return `${tenantPath(tenant, '/login')}${email ? `?email=${encodeURIComponent(email)}` : ''}`;
}

export function invitePath(tenant: string, token: string): string {
  return tenantPath(tenant, `/invite/${token}`);
}
