import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { AppLogo } from '@/shared/components/brand/Logo';
import { Button } from '@/shared/components/ui/button';

export default async function BookDemoPage() {
  const t = await getTranslations('landing.bookDemo');

  return (
    <div className="afenda-app min-h-screen bg-background">
      <main className="container mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <AppLogo href="/" placement="nav" />
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t('back')}
            </Link>
          </Button>
        </div>

        <section className="grid flex-1 gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {t('eyebrow')}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t('description')}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-none">
                <Link href="/login">{t('primaryCta')}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/docs">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  {t('secondaryCta')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t('briefingCard.eyebrow')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">{t('briefingCard.title')}</h2>
            </div>
            <dl className="divide-y divide-border">
              {['identity', 'skills', 'governance', 'audit'].map((key) => (
                <div key={key} className="grid gap-2 px-6 py-5 sm:grid-cols-[0.42fr_0.58fr]">
                  <dt className="text-sm font-medium text-foreground">{t(`briefingCard.items.${key}.term`)}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">{t(`briefingCard.items.${key}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}
