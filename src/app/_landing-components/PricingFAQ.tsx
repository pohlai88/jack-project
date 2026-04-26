'use client';

import { useTranslations } from 'next-intl';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

export function PricingFAQ() {
  const t = useTranslations('landing.faq.items');
  const itemKeys = ['try', 'startData', 'existingTools', 'assistant', 'security', 'migration'] as const;

  return (
    <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
      {itemKeys.map((itemKey, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base font-medium">{t(`${itemKey}.question`)}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{t(`${itemKey}.answer`)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
