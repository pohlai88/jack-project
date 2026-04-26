'use client';

import { AIProviderSettings } from './AIProviderSettings';
import { SettingsPageShell } from './SettingsPageShell';

export function AIProviderSettingsPageContent() {
  return (
    <SettingsPageShell title="AI Provider" description="Configure AI providers and models">
      <AIProviderSettings />
    </SettingsPageShell>
  );
}
