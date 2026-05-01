import { ArrowRight, Database, Fingerprint, GitBranch, LockKeyhole, Network, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import {
  landingEditorialIndexTw,
  landingLargeBodyTw,
  LandingPanel,
  landingPanelHeaderRowTw,
  LandingSection,
  LandingSectionHeader,
  landingStatusPillTw,
} from './landing-primitives';

const inputKeys = ['identity', 'skills', 'activity', 'knowledge'] as const;
const controlKeys = ['identityBinding', 'policyResolution', 'evidenceCommit'] as const;
const outputKeys = ['record', 'visibility', 'audit'] as const;

const inputIcons = {
  identity: Fingerprint,
  skills: Network,
  activity: GitBranch,
  knowledge: Database,
} as const;

const controlIcons = {
  identityBinding: Fingerprint,
  policyResolution: LockKeyhole,
  evidenceCommit: ShieldCheck,
} as const;

export function SystemTopology() {
  const t = useTranslations('landing.topology');

  return (
    <LandingSection id="system" titleId="system-topology-heading">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <LandingSectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            titleId="system-topology-heading"
            description={t('description')}
          />
          <p className={landingLargeBodyTw}>{t('thesis')}</p>
        </div>

        <LandingPanel>
          <div className={cn(landingPanelHeaderRowTw, 'sm:items-center')}>
            <div>
              <p className={landingEditorialIndexTw}>{t('diagram.label')}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-foreground">{t('diagram.title')}</h3>
            </div>

            <div className={cn(landingStatusPillTw, 'mt-4 px-3 py-2 text-muted-foreground sm:mt-0')}>
              {t('diagram.state')}
            </div>
          </div>

          <div className="grid gap-px bg-border/70 lg:grid-cols-[0.92fr_auto_1.1fr_auto_0.92fr]">
            <TopologyColumn title={t('inputs.title')} index="01">
              {inputKeys.map((key) => {
                const Icon = inputIcons[key];

                return (
                  <TopologyNode
                    key={key}
                    icon={Icon}
                    title={t(`inputs.items.${key}.title`)}
                    body={t(`inputs.items.${key}.body`)}
                  />
                );
              })}
            </TopologyColumn>

            <TopologyConnector label={t('connectors.normalize')} />

            <TopologyColumn title={t('controls.title')} index="02" emphasized>
              {controlKeys.map((key) => {
                const Icon = controlIcons[key];

                return (
                  <TopologyNode
                    key={key}
                    icon={Icon}
                    title={t(`controls.items.${key}.title`)}
                    body={t(`controls.items.${key}.body`)}
                    emphasized
                  />
                );
              })}
            </TopologyColumn>

            <TopologyConnector label={t('connectors.resolve')} />

            <TopologyColumn title={t('outputs.title')} index="03">
              {outputKeys.map((key) => (
                <div key={key} className="border border-border/70 bg-background px-4 py-4">
                  <p className={landingEditorialIndexTw}>{t(`outputs.items.${key}.label`)}</p>
                  <p className="mt-3 text-base font-semibold leading-6 text-foreground">
                    {t(`outputs.items.${key}.value`)}
                  </p>
                </div>
              ))}
            </TopologyColumn>
          </div>

          <div className="grid border-t border-border/70 bg-muted/15 md:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b border-border/70 px-5 py-4 md:border-b-0 md:border-r">
              <p className={landingEditorialIndexTw}>{t('consequence.label')}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{t('consequence.title')}</p>
            </div>

            <p className="px-5 py-4 text-sm leading-7 text-muted-foreground">{t('consequence.body')}</p>
          </div>
        </LandingPanel>
      </div>
    </LandingSection>
  );
}

function TopologyColumn({
  title,
  index,
  emphasized = false,
  children,
}: {
  title: string;
  index: string;
  emphasized?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={emphasized ? 'bg-card p-5' : 'bg-background p-5'}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">{title}</h3>
        <span className="font-mono text-xs text-muted-foreground">{index}</span>
      </div>

      <div className="space-y-3">{children}</div>
    </section>
  );
}

function TopologyNode({
  icon: Icon,
  title,
  body,
  emphasized = false,
}: {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
  emphasized?: boolean;
}) {
  return (
    <article
      className={
        emphasized ? 'border border-primary/25 bg-primary/5 px-4 py-4' : 'border border-border/70 bg-card px-4 py-4'
      }
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-background">
          <Icon className="h-4 w-4 text-primary" aria-hidden />
        </div>

        <div>
          <h4 className="text-sm font-semibold leading-6 text-foreground">{title}</h4>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
        </div>
      </div>
    </article>
  );
}

function TopologyConnector({ label }: { label: string }) {
  return (
    <div className="hidden min-h-full bg-background px-3 lg:flex lg:flex-col lg:items-center lg:justify-center">
      <div className="h-full w-px bg-border" />
      <div
        className={cn('my-3 flex items-center gap-2 border border-border bg-card px-2 py-1', landingEditorialIndexTw)}
      >
        {label}
        <ArrowRight className="h-3 w-3" aria-hidden />
      </div>
      <div className="h-full w-px bg-border" />
    </div>
  );
}
