'use client';

import { GeneralSettings } from './GeneralSettings';
import { SettingsPageShell } from './SettingsPageShell';

export function GeneralSettingsPageContent() {
  return (
    <SettingsPageShell title="General Settings" description="Organization details and tenant configuration">
      <GeneralSettings />
    </SettingsPageShell>
  );
}
