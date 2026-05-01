'use client';

import { useTranslations } from 'next-intl';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

import { LandingSection, LandingSectionHeader } from './landing-primitives';

const readinessQuestionKeys = ['replacement', 'start', 'integrations', 'enterpriseGrade', 'executiveReview'] as const;

export function PricingFAQ() {
  const t = useTranslations('landing.readiness.questions');

  return (
    <LandingSection compact>
      <LandingSectionHeader
        className="mb-14"
        eyebrow="Evaluation criteria"
        title="Determine whether the system fits before committing."
        description={
          <>
            These are not product questions. They are decision checkpoints used by technical, governance, and executive
            stakeholders during evaluation.
          </>
        }
      />

      <Accordion type="single" collapsible className="afenda-motion-sequence border-t border-border">
        {readinessQuestionKeys.map((itemKey, index) => (
          <AccordionItem key={itemKey} value={`readiness-${index}`} className="border-b border-border">
            <AccordionTrigger className="group py-6 text-left text-base font-semibold md:text-lg">
              <div className="flex items-start gap-4">
                <span className="mt-1 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="text-foreground">{t(`${itemKey}.question`)}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="max-w-3xl pb-6 pl-11 text-base leading-8 text-muted-foreground">
              {t(`${itemKey}.answer`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        Evaluation should reduce uncertainty, not accelerate commitment.
      </div>
    </LandingSection>
  );
}
