'use client';

import { CheckCircle, ExternalLink, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/components/ui';

import { type ExternalOAuthProvider, saveExternalOAuthCredentials } from '../services/external-oauth-settings-service';

interface ExternalOAuthCredentialsFormProps {
  tenantSlug: string;
  provider: ExternalOAuthProvider;
  providerLabel: string;
  initialClientId?: string;
  initialClientSecret?: string;
  hasEnvCredentials: boolean;
  developerUrl: string;
}

export function ExternalOAuthCredentialsForm({
  tenantSlug,
  provider,
  providerLabel,
  initialClientId = '',
  initialClientSecret = '',
  hasEnvCredentials,
  developerUrl,
}: ExternalOAuthCredentialsFormProps) {
  const router = useRouter();
  const [clientId, setClientId] = useState(initialClientId);
  const [clientSecret, setClientSecret] = useState(initialClientSecret);
  const [showSecret, setShowSecret] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  const handleTest = () => {
    setTestResult(null);
    setTestError(null);

    startTransition(async () => {
      if (clientId.trim().length < 5) {
        setTestResult('error');
        setTestError('Client ID is too short.');
        return;
      }

      if (clientSecret.trim().length < 5) {
        setTestResult('error');
        setTestError('Client secret is too short.');
        return;
      }

      setTestResult('success');
    });
  };

  const handleSave = async () => {
    if (!clientId || !clientSecret) return;

    setIsSaving(true);
    try {
      const result = await saveExternalOAuthCredentials(tenantSlug, provider, clientId, clientSecret);
      if (result.success) {
        router.refresh();
      } else {
        setTestResult('error');
        setTestError(result.error ?? 'Failed to save credentials.');
      }
    } catch {
      setTestResult('error');
      setTestError('Failed to save credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  const isConfigured = !!(clientId && clientSecret);

  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth Credentials</CardTitle>
        <CardDescription>Configure tenant-level {providerLabel} OAuth credentials.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasEnvCredentials ? (
          <Alert>
            <AlertTitle>Environment fallback configured</AlertTitle>
            <AlertDescription>
              Global OAuth credentials are available from environment variables. Tenant values entered here override the
              global fallback.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-4">
          <div>
            <Label htmlFor={`${provider}-client-id`}>Client ID</Label>
            <Input
              id={`${provider}-client-id`}
              value={clientId}
              onChange={(event) => {
                setClientId(event.target.value);
                setTestResult(null);
              }}
              placeholder="OAuth client ID"
            />
          </div>

          <div>
            <Label htmlFor={`${provider}-client-secret`}>Client Secret</Label>
            <div className="relative">
              <Input
                id={`${provider}-client-secret`}
                type={showSecret ? 'text' : 'password'}
                value={clientSecret}
                onChange={(event) => {
                  setClientSecret(event.target.value);
                  setTestResult(null);
                }}
                className="pr-10"
                placeholder="OAuth client secret"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showSecret ? 'Hide secret' : 'Show secret'}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={handleTest} disabled={isPending || !clientId || !clientSecret}>
              {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Test Credentials
            </Button>

            {testResult === 'success' ? (
              <span className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" /> Looks valid
              </span>
            ) : null}
            {testResult === 'error' ? (
              <span className="flex items-center text-red-600 text-sm">
                <XCircle className="h-4 w-4 mr-1" /> {testError ?? 'Validation failed'}
              </span>
            ) : null}
          </div>

          <div className="pt-4 border-t flex items-center justify-between gap-3">
            <a
              href={developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Developer console
              <ExternalLink className="h-3 w-3" />
            </a>

            <Button onClick={handleSave} disabled={isSaving || !isConfigured}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Credentials
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
