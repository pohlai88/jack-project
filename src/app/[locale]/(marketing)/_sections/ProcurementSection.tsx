import { ProcurementSpine } from './ProcurementSpine';
import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { ExplorerSummary } from '../_components/ExplorerSummary';
import { procurement } from '../_content/sections';

const SEVERITY: Array<'ok' | 'warn' | 'risk'> = ['ok', 'warn', 'ok', 'warn', 'risk'];

const KPI = [
  { label: 'Decision lanes', value: '5' },
  { label: 'Bound to ontology', value: '100%' },
  { label: 'Evidence required', value: 'Action-time' },
];

export function ProcurementSection() {
  return (
    <section id="procurement" className="marketing-section marketing-section--tall" aria-labelledby="procurement-title">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p className="marketing-eyebrow">Section 04 · Procurement & Finance</p>
          <h2 id="procurement-title" className="marketing-h1">
            {procurement.title}
          </h2>
          <p className="marketing-lead">{procurement.lead}</p>
          <AudienceChips sectionId="procurement" />
        </div>
        <DeepDiveTrigger explorerId="procurement" label="Open procurement explorer" />
      </div>

      <div className="marketing-cols-5" style={{ marginTop: '2rem' }}>
        {procurement.columns.map((c, i) => (
          <article key={c.name} className="marketing-col">
            <header className="marketing-col__head">
              <span className={`marketing-dot marketing-dot--${SEVERITY[i]}`} aria-hidden />
              {c.name}
            </header>
            <ul className="marketing-col__list">
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        style={{
          marginTop: '1.75rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          gap: '1.5rem',
          alignItems: 'stretch',
        }}
      >
        <aside className="marketing-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p className="marketing-mono-strong">Decision lane KPIs</p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem' }}>
            {KPI.map((k) => (
              <li
                key={k.label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--marketing-line)',
                  paddingBottom: '0.6rem',
                }}
              >
                <span className="marketing-mono">{k.label}</span>
                <span
                  style={{
                    fontFamily: 'var(--marketing-mono)',
                    fontWeight: 700,
                    color: 'var(--marketing-ink)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {k.value}
                </span>
              </li>
            ))}
          </ul>
          <p className="marketing-mono" style={{ marginTop: 'auto' }}>
            {procurement.spineNote}
          </p>
        </aside>

        <ProcurementSpine />
      </div>

      <ExplorerSummary
        explorerId="procurement"
        bullets={[
          '5 decision lanes · contract lifecycle, sourcing, ordering, supplier relations, AP',
          'Each lane records evidence on transition — no orphan POs, no shadow approvals',
          'Three-way match runs against ontology, not a screen',
          'Spine shows the canonical lifecycle the lanes ride on',
        ]}
      />
    </section>
  );
}
