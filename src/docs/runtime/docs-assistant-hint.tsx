import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export async function DocsAssistantHint() {
  const t = await getTranslations('docs.llm');

  return (
    <aside
      className="border-fd-border bg-fd-muted/30 text-fd-muted-foreground mb-4 rounded-lg border px-3 py-2 text-sm"
      aria-label={t('assistantHintAria')}
    >
      <p className="mb-2 leading-relaxed">{t('assistantHint')}</p>
      <Link href="/" className="text-fd-foreground font-medium underline-offset-4 hover:underline">
        {t('assistantCta')}
      </Link>
    </aside>
  );
}
