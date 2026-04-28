'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Link } from '@/i18n/navigation';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/components/ui';
import { normalizeCustomDomainHostname } from '@/shared/lib/custom-domain-hostname';
import { SettingsPageShell } from './SettingsPageShell';
import {
  beginCustomDomainVerification,
  clearCustomDomain,
  verifyCustomDomainDns,
} from '../../services/custom-domain-actions';
import type { CustomDomainAdminSnapshot } from '../../services/custom-domain-queries';

export interface CustomDomainSettingsPageContentProps {
  tenantSlug: string;
  initialSnapshot: CustomDomainAdminSnapshot;
}

export function CustomDomainSettingsPageContent({ tenantSlug, initialSnapshot }: CustomDomainSettingsPageContentProps) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [hostnameInput, setHostnameInput] = useState(snapshot.hostname ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const refresh = () => {
    router.refresh();
  };

  const onBegin = async () => {
    setError(null);
    setPending(true);
    try {
      const result = await beginCustomDomainVerification(tenantSlug, hostnameInput);
      if (!result.success || !result.data) {
        setError(result.error ?? 'Request failed');
        return;
      }
      const data = result.data;
      const normalized = normalizeCustomDomainHostname(hostnameInput);
      setSnapshot((s) => ({
        ...s,
        hostname: normalized,
        verifiedAt: null,
        verifyToken: null,
        txtRecordName: data.txtRecordName,
        txtRecordValue: data.txtRecordValue,
      }));
      refresh();
    } finally {
      setPending(false);
    }
  };

  const onVerify = async () => {
    setError(null);
    setPending(true);
    try {
      const result = await verifyCustomDomainDns(tenantSlug);
      if (!result.success) {
        setError(result.error ?? 'Verification failed');
        return;
      }
      setSnapshot((s) => ({
        ...s,
        verifiedAt: new Date(),
        verifyToken: null,
        txtRecordName: null,
        txtRecordValue: null,
      }));
      refresh();
    } finally {
      setPending(false);
    }
  };

  const onClear = async () => {
    setError(null);
    setPending(true);
    try {
      const result = await clearCustomDomain(tenantSlug);
      if (!result.success) {
        setError(result.error ?? 'Could not clear');
        return;
      }
      setHostnameInput('');
      setSnapshot((s) => ({
        ...s,
        hostname: null,
        verifiedAt: null,
        verifyToken: null,
        txtRecordName: null,
        txtRecordValue: null,
      }));
      refresh();
    } finally {
      setPending(false);
    }
  };

  if (!snapshot.featureEnabled) {
    return (
      <SettingsPageShell title="Custom domain" description="Bring your own hostname to this tenant">
        <Card>
          <CardHeader>
            <CardTitle>Disabled</CardTitle>
            <CardDescription>
              Set <code className="text-xs">ENABLE_CUSTOM_DOMAIN=true</code> in operator env and redeploy to use this
              feature.
            </CardDescription>
          </CardHeader>
        </Card>
      </SettingsPageShell>
    );
  }

  return (
    <SettingsPageShell
      title="Custom domain"
      description="Verify DNS ownership, then enable routing with operator env (see docs)."
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href={`/t/${tenantSlug}/admin/settings`}>← Back to general settings</Link>
          </Button>
        </p>

        {error ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Hostname</CardTitle>
            <CardDescription>
              Apex hostname only (e.g. portal.example.com). After verification, point DNS and optionally attach the
              hostname to your deployment (e.g. Vercel).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="custom-host">Hostname</Label>
              <Input
                id="custom-host"
                value={hostnameInput}
                onChange={(e) => setHostnameInput(e.target.value)}
                placeholder="portal.example.com"
                disabled={pending || !!snapshot.verifiedAt}
                className="mt-1 font-mono"
              />
            </div>
            {!snapshot.verifiedAt ? (
              <Button onClick={onBegin} disabled={pending || !hostnameInput.trim()}>
                {pending ? 'Saving…' : 'Save & show DNS TXT instructions'}
              </Button>
            ) : null}
          </CardContent>
        </Card>

        {snapshot.txtRecordName && snapshot.txtRecordValue ? (
          <Card>
            <CardHeader>
              <CardTitle>DNS TXT (verification)</CardTitle>
              <CardDescription>Add this TXT record at your DNS provider, then click Verify.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-sm break-all">
              <div>
                <span className="text-muted-foreground">Name: </span>
                {snapshot.txtRecordName}
              </div>
              <div>
                <span className="text-muted-foreground">Value: </span>
                {snapshot.txtRecordValue}
              </div>
              <Button variant="secondary" onClick={onVerify} disabled={pending}>
                {pending ? 'Checking…' : 'Verify DNS'}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {snapshot.verifiedAt ? (
          <Card>
            <CardHeader>
              <CardTitle>Verified</CardTitle>
              <CardDescription>
                Hostname <strong className="font-mono">{snapshot.hostname}</strong> verified at{' '}
                {snapshot.verifiedAt.toISOString()}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Routing from this hostname into the app requires{' '}
                <code className="text-xs">ENABLE_CUSTOM_DOMAIN_ROUTING=true</code> and a shared{' '}
                <code className="text-xs">MIDDLEWARE_TENANT_LOOKUP_SECRET</code> between proxy and the internal lookup
                route.
              </p>
              <p
                className={
                  snapshot.routingEnabled ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'
                }
              >
                {snapshot.routingEnabled
                  ? 'Custom domain routing is enabled for this deployment.'
                  : 'Custom domain routing is not enabled yet—requests may still need path-based /t/[slug] URLs.'}
              </p>
              <Button variant="destructive" size="sm" onClick={onClear} disabled={pending}>
                Remove custom domain
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </SettingsPageShell>
  );
}
