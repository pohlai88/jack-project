import type { TenantSettings } from '@/shared/lib/tenant-settings';

import type { AuditLogFilters } from './services/audit-logs-service';

export { AdminPageHeader } from './components/AdminPageHeader';
export { AuditLogsClient } from './components/AuditLogsClient';
export { GitHubCredentialsForm } from './components/GitHubCredentialsForm';
export { GitHubSettingsPanel } from './components/GitHubSettingsPanel';
export { IntegrationControlPlanePanel } from './components/IntegrationControlPlanePanel';
export { InvitesClient } from './components/InvitesClient';
export { MembersClient } from './components/MembersClient';
export { RolesClient } from './components/RolesClient';
export { WebhooksClient } from './components/WebhooksClient';
export { WebhooksSettingsPanel } from './components/WebhooksSettingsPanel';
export { AIProviderSettings } from './components/settings/AIProviderSettings';
export { AIProviderSettingsPageContent } from './components/settings/AIProviderSettingsPageContent';
export { BrandingSettings } from './components/settings/BrandingSettings';
export { BrandingSettingsPageContent } from './components/settings/BrandingSettingsPageContent';
export { GeneralSettings } from './components/settings/GeneralSettings';
export { GeneralSettingsPageContent } from './components/settings/GeneralSettingsPageContent';
export { SettingsProvider, useSettings } from './components/settings/SettingsProvider';
export { StorageSettings } from './components/settings/StorageSettings';
export { StorageSettingsPageContent } from './components/settings/StorageSettingsPageContent';
export type { SaveStatus } from './components/settings/SettingsProvider';
export {
  consumeConnectionTestRateLimit,
  resetConnectionTestRateLimitStore,
  testAIConnection,
  testStorageConnection,
} from './services/connection-test-service';
export type {
  AIConnectionTestInput,
  ConnectionTestCode,
  ConnectionTestResult,
  StorageConnectionTestInput,
} from './types/connection-test';

export async function getAdminStats(tenantSlug: string) {
  const { getAdminStats } = await import('./services/admin-stats-service');
  return getAdminStats(tenantSlug);
}

export async function getAuditActors(tenantSlug: string) {
  const { getAuditActors } = await import('./services/audit-logs-service');
  return getAuditActors(tenantSlug);
}

export async function getDistinctActions(tenantSlug: string) {
  const { getDistinctActions } = await import('./services/audit-logs-service');
  return getDistinctActions(tenantSlug);
}

export async function getDistinctEntityTypes(tenantSlug: string) {
  const { getDistinctEntityTypes } = await import('./services/audit-logs-service');
  return getDistinctEntityTypes(tenantSlug);
}

export async function listAuditEvents(tenantSlug: string, filters: AuditLogFilters) {
  const { listAuditEvents } = await import('./services/audit-logs-service');
  return listAuditEvents(tenantSlug, filters);
}

export async function getGitHubTenantCredentials(tenantSlug: string) {
  const { getGitHubTenantCredentials } = await import('./services/github-credentials-service');
  return getGitHubTenantCredentials(tenantSlug);
}

export async function getGitHubConnectionInfo(userId: string) {
  const { getGitHubConnectionInfo } = await import('./services/github-settings-service');
  return getGitHubConnectionInfo(userId);
}

export async function acceptInvite(tenantSlug: string, token: string, userId: string) {
  const { acceptInvite } = await import('./services/invite-service');
  return acceptInvite(tenantSlug, token, userId);
}

export async function validateInviteToken(tenantSlug: string, token: string) {
  const { validateInviteToken } = await import('./services/invite-service');
  return validateInviteToken(tenantSlug, token);
}

export async function listMembers(tenantSlug: string, params?: { page?: number; pageSize?: number; search?: string }) {
  const { listMembers } = await import('./services/members-service');
  return listMembers(tenantSlug, params);
}

export async function listPermissions(tenantSlug: string) {
  const { listPermissions } = await import('./services/roles-service');
  return listPermissions(tenantSlug);
}

export async function listRoles(tenantSlug: string) {
  const { listRoles } = await import('./services/roles-service');
  return listRoles(tenantSlug);
}

export async function getTenantSettings(tenantSlug: string) {
  const { getTenantSettings } = await import('./services/settings-service');
  return getTenantSettings(tenantSlug);
}

export async function getTenantWithSettings(tenantSlug: string) {
  const { getTenantWithSettings } = await import('./services/settings-service');
  return getTenantWithSettings(tenantSlug);
}

export async function resetTenantSettings(tenantSlug: string) {
  const { resetTenantSettings } = await import('./services/settings-service');
  return resetTenantSettings(tenantSlug);
}

export async function updateTenantInfo(tenantSlug: string, updates: { name?: string; description?: string }) {
  const { updateTenantInfo } = await import('./services/settings-service');
  return updateTenantInfo(tenantSlug, updates);
}

export async function updateTenantSettings(tenantSlug: string, updates: Partial<TenantSettings>) {
  const { updateTenantSettings } = await import('./services/settings-service');
  return updateTenantSettings(tenantSlug, updates);
}

export async function getAvailableEventTypes() {
  const { getAvailableEventTypes } = await import('./services/webhook-admin-service');
  return getAvailableEventTypes();
}

export async function listWebhookEndpoints(tenantSlug: string) {
  const { listWebhookEndpoints } = await import('./services/webhook-admin-service');
  return listWebhookEndpoints(tenantSlug);
}
