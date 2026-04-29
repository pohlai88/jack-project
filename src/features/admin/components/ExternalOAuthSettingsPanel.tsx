'use client';

import { CheckCircle, Link2Off, Loader2, RefreshCw, Settings, Unlink } from 'lucide-react';
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
  Label,
  Switch,
} from '@/shared/components/ui';

import {
  disconnectExternalOAuth,
  type ExternalOAuthProvider,
  updateExternalOAuthSettings,
} from '../services/external-oauth-settings-service';

interface ExternalOAuthSettingsPanelProps {
  tenantSlug: string;
  provider: ExternalOAuthProvider;
  providerLabel: string;
  providerPath: string;
  enabled?: boolean;
  isConnected: boolean;
  connectedDisplayName?: string;
  connectedEmail?: string;
  hasEnvCredentials?: boolean;
}

export function ExternalOAuthSettingsPanel({
  tenantSlug,
  provider,
  providerLabel,
  providerPath,
  enabled: initialEnabled,
  isConnected,
  connectedDisplayName,
  connectedEmail,
  hasEnvCredentials,
}: ExternalOAuthSettingsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [enabled, setEnabled] = useState(initialEnabled ?? false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleConnect = () => {
    const returnUrl = `/t/${tenantSlug}/admin/integrations/${providerPath}`;
    window.location.href = `/api/integrations/${providerPath}/connect?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const handleSave = () => {
    setSaveStatus('saving');
    startTransition(async () => {
      const result = await updateExternalOAuthSettings(tenantSlug, provider, { enabled });
      if (result.success) {
        setSaveStatus('saved');
        router.refresh();
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    });
  };

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${providerLabel}?`)) return;

    setIsDisconnecting(true);
    try {
      const result = await disconnectExternalOAuth(tenantSlug, provider);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Link2Off className="h-5 w-5 text-muted-foreground" />
            )}
            Connection Status
          </CardTitle>
          <CardDescription>
            {isConnected
              ? `Connected as ${connectedDisplayName ?? connectedEmail ?? 'Unknown account'}`
              : `${providerLabel} is not connected.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasEnvCredentials ? (
            <Alert>
              <AlertTitle>Environment fallback configured</AlertTitle>
              <AlertDescription>Global OAuth credentials are available for this integration.</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex gap-2 flex-wrap">
            {isConnected ? (
              <>
                <Button variant="outline" size="sm" onClick={handleConnect}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDisconnect} disabled={isDisconnecting}>
                  {isDisconnecting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect}>Connect {providerLabel}</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Settings
          </CardTitle>
          <CardDescription>Control whether this tenant can use the {providerLabel} integration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable Integration</Label>
              <p className="text-xs text-muted-foreground">
                Enabled integrations can run tenant-scoped OAuth workflows.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              {saveStatus === 'saved' ? (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </span>
              ) : null}
              {saveStatus === 'error' ? <span className="text-sm text-red-600">Save failed</span> : null}
            </div>
            <Button onClick={handleSave} disabled={isPending || saveStatus === 'saving'}>
              {isPending || saveStatus === 'saving' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
