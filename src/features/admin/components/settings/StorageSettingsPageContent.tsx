'use client';

import { SettingsPageShell } from './SettingsPageShell';
import { StorageSettings } from './StorageSettings';

export function StorageSettingsPageContent() {
  return (
    <SettingsPageShell title="Storage" description="Configure S3-compatible storage for file uploads">
      <StorageSettings />
    </SettingsPageShell>
  );
}
