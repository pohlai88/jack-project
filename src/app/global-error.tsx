'use client';

import { useEffect } from 'react';

import { AppLogo } from '@/shared/components/brand/Logo';
import { Button } from '@/shared/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="afenda-app flex min-h-screen items-center bg-background text-foreground">
          <section className="container max-w-3xl py-20">
            <div className="border-t border-border pt-10">
              <AppLogo placement="error" href={null} showText={false} className="mb-10" />

              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-destructive">System Exception</p>

                <h1 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                  The application surface failed to resolve.
                </h1>

                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  An unexpected runtime exception interrupted the current request. Retry the operation, or reference the
                  diagnostic record below if the issue persists.
                </p>

                {error.digest && (
                  <div className="max-w-xl border border-border bg-card px-4 py-3 text-left text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Error digest:</span> {error.digest}
                  </div>
                )}

                <div className="pt-6">
                  <Button type="button" size="lg" onClick={() => reset()}>
                    Retry request
                  </Button>
                </div>
              </div>

              <div className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
                Global runtime boundary · Afenda application layer
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
