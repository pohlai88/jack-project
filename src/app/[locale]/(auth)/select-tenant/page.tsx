import { Building2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import { CreateOrganizationForm } from '@/features/auth';
import { localizeHref } from '@/i18n';
import { Link } from '@/i18n/navigation';
import { AppLogo } from '@/shared/components/brand/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';

import type { TenantRole } from '@/shared/db/schema/auth';
import { auth } from '@/shared/lib/auth';
import { env } from '@/shared/lib/env';

export const metadata = {
  title: 'Select Organization | Afenda',
  description: 'Choose an organization to access',
};

// Force dynamic rendering - this page depends on session data
export const dynamic = 'force-dynamic';

/**
 * Tenant Selector Page
 *
 * Shown when a user has access to multiple tenants.
 * Allows them to choose which organization to access.
 */
export default async function SelectTenantPage() {
  const session = await auth();
  const locale = await getLocale();

  // Must be logged in to see this page
  if (!session?.user) {
    redirect(localizeHref(locale, '/login'));
  }

  const userRoles = session.user.roles as Record<string, TenantRole> | undefined;
  const tenantSlugs = userRoles ? Object.keys(userRoles) : [];

  // No memberships - show message (optional self-service create)
  if (tenantSlugs.length === 0) {
    if (env.ENABLE_SELF_SERVICE_TENANT_CREATE) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-amber-500/5 p-4">
          <Card className="w-full max-w-md border shadow-lg bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <Building2 className="h-7 w-7 text-amber-500" />
              </div>
              <CardTitle>Create your organization</CardTitle>
              <CardDescription>
                Signed in as <strong>{session.user.email}</strong>. You don&apos;t belong to any workspace yet—create
                one to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateOrganizationForm />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Prefer to join an existing team? Ask an admin for an invitation link.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-500/5 p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 mb-4">
            <Building2 className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">No Organizations</h1>
          <p className="text-muted-foreground mb-4">
            You&apos;re signed in as <strong>{session.user.email}</strong>, but you don&apos;t have access to any
            organizations yet.
          </p>
          <p className="text-sm text-muted-foreground">Ask your organization admin to send you an invitation link.</p>
        </div>
      </div>
    );
  }

  // Single membership - redirect directly
  if (tenantSlugs.length === 1) {
    redirect(localizeHref(locale, `/t/${tenantSlugs[0]}`));
  }

  // Multiple memberships - show selector
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <AppLogo placement="auth" href={null} showText={false} className="mb-4 justify-center" />
          <h1 className="text-3xl font-bold brand-gradient-text">Select Organization</h1>
          <p className="text-muted-foreground mt-2">Choose which workspace to access</p>
        </div>

        <Card className="border shadow-xl bg-card">
          <CardHeader className="text-center">
            <CardTitle>Your Organizations</CardTitle>
            <CardDescription>Signed in as {session.user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenantSlugs.map((slug) => {
              const role = userRoles![slug];
              return (
                <Link
                  key={slug}
                  href={`/t/${slug}`}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{slug}</p>
                      <p className="text-xs text-muted-foreground capitalize">{role}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
