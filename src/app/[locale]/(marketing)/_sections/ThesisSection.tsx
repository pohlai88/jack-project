import { ThesisDotPanel } from './ThesisDotPanel';
import { AudienceChips } from '../_components/AudienceChips';
import { thesis } from '../_content/sections';

export function ThesisSection() {
  return (
    <section id="thesis" className="marketing-section marketing-section--tall" aria-labelledby="thesis-title">
      <div className="marketing-frame">
        <div>
          <p className="marketing-eyebrow">{thesis.kicker}</p>
          <h2 id="thesis-title" className="marketing-h1">
            {thesis.headlineLines[0]}
            <br />
            <span className="soft">{thesis.headlineLines[1]}</span>
          </h2>
          <p className="marketing-lead">
            Tools accumulate{' '}
            <em className="not-italic" style={{ color: 'var(--marketing-ink)' }}>
              data
            </em>
            . Afenda commits{' '}
            <em className="not-italic" style={{ color: 'var(--marketing-green)' }}>
              truth
            </em>{' '}
            — one canonical record bound to actor, policy, and evidence at the moment of the action.
          </p>
          <AudienceChips sectionId="thesis" />
          <ol style={{ marginTop: '1.75rem', paddingLeft: 0, listStyle: 'none' }}>
            {thesis.pullQuotes.map((q) => (
              <li
                key={q}
                className="marketing-mono"
                style={{
                  paddingLeft: '1rem',
                  borderLeft: '1px solid var(--marketing-line-2)',
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  color: 'var(--marketing-muted)',
                }}
              >
                {q}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {thesis.panels.map((p, i) => (
            <ThesisDotPanel key={p.title} title={p.title} caption={p.caption} mode={i as 0 | 1 | 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
