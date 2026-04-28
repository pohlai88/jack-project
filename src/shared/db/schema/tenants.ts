import { text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { appSchema } from './schema';

/**
 * Tenants table - Multi-tenancy support
 *
 * Each tenant represents an organization using Afenda.
 * All data is scoped to a tenant for isolation.
 *
 * Note: settings is stored as JSON text. Use parseTenantSettings() from
 * @/shared/lib/tenant-settings to parse it into the typed TenantSettings object.
 */
export const tenants = appSchema.table('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  /** Optional host label when it differs from `slug`; null means use `slug` for `{slug}.{root}` resolution. */
  subdomain: varchar('subdomain', { length: 100 }).unique(),
  /**
   * Verified custom apex hostname (e.g. portal.customer.com), lowercase, no port.
   * When set and `custom_domain_verified_at` is non-null, routing may resolve the tenant from Host (see proxy + internal lookup).
   */
  customDomainHostname: varchar('custom_domain_hostname', { length: 253 }).unique(),
  customDomainVerifiedAt: timestamp('custom_domain_verified_at', { withTimezone: true }),
  /** Secret token shown for DNS TXT verification until verified or cleared. */
  customDomainVerifyToken: varchar('custom_domain_verify_token', { length: 128 }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),

  // Settings (stored as JSON string, parsed via parseTenantSettings)
  settings: text('settings'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Types
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
