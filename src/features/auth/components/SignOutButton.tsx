'use client';

import { Button } from '@/shared/components/ui';
import { performClientSignOut } from '@/shared/lib/client-sign-out';

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        void performClientSignOut('/');
      }}
    >
      Sign Out
    </Button>
  );
}
