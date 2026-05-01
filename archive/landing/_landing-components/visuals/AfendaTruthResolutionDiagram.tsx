import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  FileCheck2,
  Fingerprint,
  Lock,
  Network,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { landingKickerTw } from '../landing-primitives';

const signalKeys = [
  { key: 'identity', Icon: Fingerprint },
  { key: 'skills', Icon: BadgeCheck },
  { key: 'activity', Icon: Activity },
  { key: 'knowledge', Icon: BookOpen },
] as const;

const coreKeys = [
  { key: 'identityBinding', Icon: UserCheck },
  { key: 'policyResolution', Icon: ShieldCheck },
  { key: 'evidenceCommit', Icon: FileCheck2 },
] as const;

const recordFieldKeys = ['recordId', 'identity', 'skills', 'policyOutcome', 'evidenceHash'] as const;

const auditKeys = [
  { key: 'proof', Icon: CheckCircle2 },
  { key: 'monitoring', Icon: BarChart3 },
  { key: 'trace', Icon: Network },
] as const;

const proofTagKeys = ['nonBypassable', 'identityBound', 'auditReady'] as const;

export function AfendaTruthResolutionDiagram() {
  const heroPreview = useTranslations('landing.heroPreview');
  const t = useTranslations('landing.heroPreview.diagram');

  return (
    <aside className="afenda-resolution" aria-label={heroPreview('ariaLabel')}>
      <div className="afenda-resolution-frame">
        <div className="afenda-resolution-grid" aria-hidden />

        <header className="afenda-resolution-header">
          <div>
            <p className={landingKickerTw}>{t('eyebrow')}</p>
            <h2 className="afenda-resolution-title">{t('title')}</h2>
            <p className="afenda-resolution-subtitle">{t('subtitle')}</p>
          </div>

          <div className="afenda-resolution-trace" aria-label={t('trace.label')}>
            <span>{t('trace.mode')}</span>
            <strong>{t('trace.state')}</strong>
          </div>
        </header>

        <div className="afenda-resolution-map">
          <section className="afenda-resolution-stage afenda-resolution-stage--signals">
            <StageHeader index="01" title={t('stages.signals.title')} subtitle={t('stages.signals.subtitle')} />

            <div className="afenda-resolution-signal-stack">
              {signalKeys.map(({ key, Icon }) => (
                <div className="afenda-resolution-signal" key={key}>
                  <span className="afenda-resolution-icon">
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  <span>{t(`stages.signals.items.${key}`)}</span>
                </div>
              ))}
            </div>
          </section>

          <FlowConnector label={t('connectors.normalize')} />

          <section className="afenda-resolution-stage afenda-resolution-stage--boundary">
            <StageHeader index="02" title={t('stages.boundary.title')} subtitle={t('stages.boundary.subtitle')} />

            <div className="afenda-resolution-boundary" aria-hidden>
              <div className="afenda-resolution-boundary-slab">
                <Lock className="h-5 w-5" />
              </div>
            </div>

            <p className="afenda-resolution-stage-note">{t('stages.boundary.note')}</p>
          </section>

          <FlowConnector label={t('connectors.govern')} />

          <section className="afenda-resolution-stage afenda-resolution-stage--core">
            <StageHeader index="03" title={t('stages.core.title')} subtitle={t('stages.core.subtitle')} />

            <div className="afenda-resolution-core-stack">
              {coreKeys.map(({ key, Icon }) => (
                <div className="afenda-resolution-core-step" key={key}>
                  <span className="afenda-resolution-core-icon">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span>{t(`stages.core.items.${key}`)}</span>
                </div>
              ))}
            </div>
          </section>

          <FlowConnector label={t('connectors.commit')} />

          <section className="afenda-resolution-stage afenda-resolution-stage--record">
            <StageHeader index="04" title={t('stages.record.title')} subtitle={t('stages.record.subtitle')} />

            <div className="afenda-resolution-record">
              <div className="afenda-resolution-record-heading">
                <Database aria-hidden className="h-5 w-5" />
                <div>
                  <p>{t('stages.record.cardTitle')}</p>
                  <span>{t('stages.record.cardSubtitle')}</span>
                </div>
              </div>

              <dl className="afenda-resolution-record-fields">
                {recordFieldKeys.map((key) => (
                  <div key={key}>
                    <dt>{t(`stages.record.fields.${key}.term`)}</dt>
                    <dd>{t(`stages.record.fields.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <FlowConnector label={t('connectors.expose')} />

          <section className="afenda-resolution-stage afenda-resolution-stage--audit">
            <StageHeader index="05" title={t('stages.audit.title')} subtitle={t('stages.audit.subtitle')} />

            <div className="afenda-resolution-audit-stack">
              {auditKeys.map(({ key, Icon }) => (
                <div className="afenda-resolution-audit-item" key={key}>
                  <span className="afenda-resolution-icon">
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  <div>
                    <p>{t(`stages.audit.items.${key}.title`)}</p>
                    <span>{t(`stages.audit.items.${key}.body`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="afenda-resolution-footer">
          <p>{t('flowLabel')}</p>

          <div className="afenda-resolution-proof-tags">
            {proofTagKeys.map((key) => (
              <span className="afenda-resolution-proof-tag" key={key}>
                {t(`proofTags.${key}`)}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </aside>
  );
}

function StageHeader({ index, title, subtitle }: { index: string; title: string; subtitle: string }) {
  return (
    <header className="afenda-resolution-stage-header">
      <span>{index}</span>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </header>
  );
}

function FlowConnector({ label }: { label: string }) {
  return (
    <div className="afenda-resolution-connector" aria-hidden>
      <span>{label}</span>
    </div>
  );
}
