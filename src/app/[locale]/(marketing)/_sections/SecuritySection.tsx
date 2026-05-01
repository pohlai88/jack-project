import { SecurityEnvelope } from './SecurityEnvelope';
import { AudienceChips } from '../_components/AudienceChips';
import { security } from '../_content/sections';

const ROW = [
  {
    name: 'Purpose envelope',
    def: 'Each access carries a declared business purpose. Without purpose, no resolution.',
  },
  {
    name: 'Redaction & retention',
    def: 'Field-level redaction by purpose; retention bound to record class, not bucket.',
  },
  {
    name: 'Role-vs-purpose',
    def: 'Roles describe identity. Purpose constrains intent. Both must agree.',
  },
  {
    name: 'Lineage of access',
    def: 'Every read is recorded with actor, purpose, and policy decision — replayable.',
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="marketing-section marketing-section--tall" aria-labelledby="security-title">
      <div className="marketing-frame">
        <div>
          <p className="marketing-eyebrow">Section 07 · Security & access</p>
          <h2 id="security-title" className="marketing-h1">
            {security.title}
          </h2>
          <p className="marketing-lead">{security.lead}</p>
          <AudienceChips sectionId="security" />
          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.85rem', marginTop: '1.75rem' }}>
            {ROW.map((r) => (
              <li
                key={r.name}
                style={{
                  borderLeft: '1px solid var(--marketing-line-2)',
                  paddingLeft: '1rem',
                }}
              >
                <p className="marketing-mono-strong">{r.name}</p>
                <p style={{ fontSize: '0.92rem', color: 'var(--marketing-muted)', lineHeight: 1.55, marginTop: '4px' }}>
                  {r.def}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <SecurityEnvelope />
      </div>
    </section>
  );
}
