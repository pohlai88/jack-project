'use client';

import { CheckCircle, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

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
import { aiProviders } from '@/shared/lib/tenant-settings';

import { useSettings } from './SettingsProvider';
import type { ConnectionTestResult } from '../../types/connection-test';

function getAIConnectionMessage(result: ConnectionTestResult): string {
  if (result.ok) {
    return result.message;
  }

  if (result.code === 'INVALID_CREDENTIALS') {
    return result.message || 'The AI provider rejected the provided credentials.';
  }
  if (result.code === 'NETWORK_ERROR') {
    return result.message || 'The AI provider could not be reached. Please try again.';
  }
  if (result.code === 'UNSUPPORTED_PROVIDER') {
    return result.message || 'This AI provider is not supported.';
  }

  return result.message || 'The AI connection test failed.';
}

export function AIProviderSettings() {
  const { ai, settings, setSettings, isPending, handleSave, tenantSlug } = useSettings();

  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  const handleAIUpdate = (key: keyof NonNullable<typeof settings.ai>, value: unknown) => {
    const newAI = { ...ai, [key]: value };
    setSettings({ ...settings, ai: newAI });
    setTestResult(null);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`/api/tenants/${tenantSlug}/admin/settings/ai/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: ai.provider,
          apiKey: settings.ai?.apiKey,
        }),
      });

      const result = (await response.json()) as ConnectionTestResult;
      setTestResult(result);
    } catch {
      setTestResult({
        ok: false,
        message: 'Unable to run the AI connection test right now.',
        code: 'UNKNOWN',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Configuration</CardTitle>
          <CardDescription>Configure your AI provider for skill extraction and chat features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="ai-provider">AI Provider</Label>
            <p className="text-xs text-muted-foreground mb-2">Select your AI provider</p>
            <select
              id="ai-provider"
              value={ai.provider || ''}
              onChange={(e) => handleAIUpdate('provider', e.target.value || undefined)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select provider...</option>
              {aiProviders.map((p) => (
                <option key={p} value={p}>
                  {p === 'openai' ? 'OpenAI' : 'Anthropic'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="ai-api-key">API Key</Label>
            <p className="text-xs text-muted-foreground mb-2">Your provider API key (stored securely)</p>
            <div className="relative">
              <Input
                id="ai-api-key"
                type={showApiKey ? 'text' : 'password'}
                value={settings.ai?.apiKey || ''}
                onChange={(e) => handleAIUpdate('apiKey', e.target.value || undefined)}
                className="pr-10"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testing || !settings.ai?.provider || !settings.ai?.apiKey}
            >
              {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Test Connection
            </Button>
            {testResult?.ok && (
              <span className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" /> {getAIConnectionMessage(testResult)}
              </span>
            )}
            {testResult && !testResult.ok && (
              <span className="flex items-center text-red-600 text-sm">
                <XCircle className="h-4 w-4 mr-1" /> {getAIConnectionMessage(testResult)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>Configure which models to use for different tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="embedding-model">Embedding Model</Label>
            <p className="text-xs text-muted-foreground mb-2">Model for generating embeddings</p>
            <Input
              id="embedding-model"
              value={ai.embeddingModel || ''}
              onChange={(e) => handleAIUpdate('embeddingModel', e.target.value)}
              placeholder="text-embedding-3-small"
            />
          </div>
          <div>
            <Label htmlFor="chat-model">Chat Model</Label>
            <p className="text-xs text-muted-foreground mb-2">Model for AI assistant chat</p>
            <Input
              id="chat-model"
              value={ai.chatModel || ''}
              onChange={(e) => handleAIUpdate('chatModel', e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>
          <div>
            <Label htmlFor="extraction-model">Extraction Model</Label>
            <p className="text-xs text-muted-foreground mb-2">Model for CV skill extraction</p>
            <Input
              id="extraction-model"
              value={ai.extractionModel || ''}
              onChange={(e) => handleAIUpdate('extractionModel', e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={ai.temperature ?? 0.1}
                onChange={(e) => handleAIUpdate('temperature', parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
            <div>
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                min="100"
                max="16000"
                step="100"
                value={ai.maxTokens ?? 4000}
                onChange={(e) => handleAIUpdate('maxTokens', parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
          <Button onClick={() => handleSave('ai', { ai })} disabled={isPending}>
            Save AI Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
