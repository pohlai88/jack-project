'use client';

import { SecurityEnvelope } from '../_sections/SecurityEnvelope';

const SECURITY_DEPTH_ROWS = [
  {
    label: 'Identity layer',
    detail: 'Tenant identity, SSO posture, and multi-factor policy define who can ask.',
  },
  {
    label: 'Purpose layer',
    detail: 'Every read is justified by intent, role, and operating context.',
  },
  {
    label: 'Record layer',
    detail: 'Redaction, retention, and lineage are evaluated against the resolved record.',
  },
] as const;

export function SecurityExplorerBody() {
  return (
    <div className="security-explorer">
      <div className="security-explorer__copy">
        <p className="marketing-mono">Purpose envelope / deep dive</p>
        <h3>Access is resolved outside-in.</h3>
        <p>
          The visible section shows the control certificate. This explorer keeps the diagram: tenant scope, identity,
          purpose, policy, and record state are evaluated before business truth is exposed.
        </p>
      </div>

      <div className="security-explorer__grid">
        <div className="security-explorer__rows">
          {SECURITY_DEPTH_ROWS.map((row) => (
            <article key={row.label} className="security-explorer__row">
              <h4>{row.label}</h4>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
        <SecurityEnvelope />
      </div>
    </div>
  );
}
