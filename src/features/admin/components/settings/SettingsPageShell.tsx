'use client';

import type { ReactNode } from 'react';

import { useSettings } from './SettingsProvider';

interface SettingsPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SettingsPageShell({ title, description, children }: SettingsPageShellProps) {
  const { saveStatus } = useSettings();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {saveStatus !== 'idle' && (
        <div
          className={`rounded-md px-4 py-2 text-sm ${
            saveStatus === 'saving'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              : saveStatus === 'saved'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Settings saved successfully!'}
          {saveStatus === 'error' && 'Failed to save settings. Please try again.'}
        </div>
      )}

      {children}
    </>
  );
}
