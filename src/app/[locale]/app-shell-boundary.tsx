'use client';

import { usePathname, useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';

interface AppShellBoundaryProps {
  children: ReactNode;
}

/**
 * Rendering authority boundary.
 *
 * `/docs` remains owned by Fumadocs.
 * Non-docs routes receive the Afenda application shell scope.
 */
export function AppShellBoundary({ children }: AppShellBoundaryProps) {
  const [firstSegment] = useSelectedLayoutSegments();
  const pathname = usePathname();
  const isDocsRoute = firstSegment === 'docs';
  const isMarketingRoot = /^\/[^/]+\/?$/.test(pathname);

  if (isDocsRoute) {
    return <>{children}</>;
  }

  return <div className={isMarketingRoot ? 'afenda-app afenda-app--marketing' : 'afenda-app'}>{children}</div>;
}
