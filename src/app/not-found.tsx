import { Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { AppLogo } from '@/shared/components/brand/Logo';
import { Button } from '@/shared/components/ui/button';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="afenda-app flex min-h-screen items-center bg-background">
      <div className="container max-w-3xl py-20">
        <div className="border-t border-border pt-10">
          <AppLogo placement="error" href={null} showText={false} className="mb-10" />

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Navigation Exception</p>

            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
              The requested resource cannot be resolved.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              The route you attempted to access does not exist within the current system surface, or the reference is no
              longer valid. This may occur due to navigation drift, outdated links, or restricted access boundaries.
            </p>

            <div className="pt-6 flex items-center gap-3">
              <Link href="/">
                <Button size="lg" className="gap-2">
                  <Home className="h-4 w-4" />
                  Return to root
                </Button>
              </Link>

              <Link href="/docs">
                <Button size="lg" variant="outline">
                  View system documentation
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
            HTTP 404 · Resource not found · Afenda routing layer
          </div>
        </div>
      </div>
    </div>
  );
}
