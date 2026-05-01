import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { security } from '../_content/sections';

const SECURITY_CONTROLS = [
  {
    domain: 'Identity boundary',
    term: 'SSO + MFA posture',
    benefit: 'Tenant users enter through governed identity before any record resolves.',
  },
  {
    domain: 'Purpose gate',
    term: 'Justified access',
    benefit: 'Role alone is not enough; every read carries a business purpose.',
  },
  {
    domain: 'Data handling',
    term: 'Redaction class',
    benefit: 'Sensitive fields narrow by purpose, retention, and record category.',
  },
  {
    domain: 'Audit evidence',
    term: 'Replayable decision',
    benefit: 'Actor, purpose, policy result, and record state stay inspectable.',
  },
];

const CERTIFICATE_EVIDENCE = [
  ['Tenant scope', 'Bound'],
  ['Policy decision', 'Captured'],
  ['Access lineage', 'Replayable'],
  ['Retention class', 'Mapped'],
] as const;

function SecurityCertificate() {
  return (
    <section className="security-cert" aria-label="Security posture certificate">
      <div className="security-cert__header">
        <div>
          <p className="security-cert__eyebrow">Control certificate</p>
          <h3 className="security-cert__title">Security posture evidence</h3>
        </div>
        <span className="security-cert__serial">AFD-SEC-007</span>
      </div>

      <div className="security-cert__seal" aria-label="Control posture ready">
        <span>Purpose-bound</span>
        <strong>Access Control</strong>
        <small>evidence ready</small>
      </div>

      <div className="security-cert__controls">
        {SECURITY_CONTROLS.map((control) => (
          <article key={control.domain} className="security-cert__control">
            <p>{control.domain}</p>
            <h4>{control.term}</h4>
            <span>{control.benefit}</span>
          </article>
        ))}
      </div>

      <div className="security-cert__ledger" aria-label="Control evidence ledger">
        {CERTIFICATE_EVIDENCE.map(([label, value]) => (
          <div key={label} className="security-cert__ledger-row">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SecuritySection() {
  return (
    <MarketingSection id="security" className="marketing-section--tall" aria-labelledby="security-title">
      <div className="marketing-frame security-section__frame">
        <div>
          <p className="marketing-eyebrow">Section 07 · Security & access</p>
          <h2 id="security-title" className="marketing-h1">
            {security.title}
          </h2>
          <p className="marketing-lead">{security.lead}</p>
          <AudienceChips sectionId="security" />
          <div className="security-section__actions">
            <DeepDiveTrigger explorerId="security" label="Open security explorer" />
          </div>
        </div>
        <SecurityCertificate />
      </div>
    </MarketingSection>
  );
}
