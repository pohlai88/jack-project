'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';

interface AppShellBoundaryProps {
  children: ReactNode;
}

const DOCS_SEGMENT = 'docs';

export function AppShellBoundary({ children }: AppShellBoundaryProps) {
  const segments = useSelectedLayoutSegments();
  const isDocsRoute = segments.includes(DOCS_SEGMENT);

  if (isDocsRoute) {
    return <>{children}</>;
  }

  return <div className="afenda-app">{children}</div>;
}
