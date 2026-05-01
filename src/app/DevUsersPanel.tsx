'use client';

import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { useState } from 'react';

import { Link } from '@/i18n/navigation';

const DEV_TENANT_SLUG = 'afenda';

const DEV_USERS = [
  {
    label: 'Admin',
    email: 'admin@example.com',
    role: 'Full access',
    description: 'Administrative tenant access.',
  },
  {
    label: 'Member',
    email: 'member@example.com',
    role: 'Standard access',
    description: 'Seeded member account.',
  },
  {
    label: 'New member',
    email: 'member_new@example.com',
    role: 'Onboarding',
    description: 'Empty-state onboarding account.',
  },
] as const;

export function DevUsersPanel() {
  const [collapsed, setCollapsed] = useState(true);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        aria-label="Open development user panel"
      >
        <Code2 className="h-4 w-4" aria-hidden />
        Dev access
        <ChevronUp className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <aside className="fixed bottom-4 left-4 z-50 w-[20rem] border border-border bg-background shadow-lg">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" aria-hidden />
          <p className="text-sm font-semibold text-foreground">Development access</p>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Collapse development user panel"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      </header>

      <div className="px-4 py-3">
        <p className="text-xs leading-5 text-muted-foreground">
          Tenant: <code className="font-mono text-foreground">{DEV_TENANT_SLUG}</code>
        </p>
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {DEV_USERS.map((devUser) => (
          <li key={devUser.email}>
            <Link
              href={`/t/${DEV_TENANT_SLUG}/login?email=${encodeURIComponent(devUser.email)}`}
              className="block px-4 py-3 transition-colors hover:bg-muted/40"
              aria-label={`Sign in as ${devUser.label}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{devUser.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{devUser.description}</p>
                </div>

                <span className="shrink-0 border border-border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {devUser.role}
                </span>
              </div>

              <code className="mt-2 block truncate font-mono text-[11px] text-muted-foreground">{devUser.email}</code>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
