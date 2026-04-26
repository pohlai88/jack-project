'use client';

import { BrandingSettings } from './BrandingSettings';
import { SettingsPageShell } from './SettingsPageShell';

export function BrandingSettingsPageContent() {
  return (
    <SettingsPageShell title="Branding" description="Customize the look and feel of your organization">
      <BrandingSettings />
    </SettingsPageShell>
  );
}
