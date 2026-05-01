import { EvidencePack } from './EvidencePack';
import { AudienceChips } from '../_components/AudienceChips';
import { evidence } from '../_content/sections';

export function EvidenceSection() {
  return (
    <section id="evidence" className="marketing-section marketing-section--tall" aria-labelledby="evidence-title">
      <div className="marketing-frame">
        <div>
          <p className="marketing-eyebrow">Section 08 · Trust & evidence</p>
          <h2 id="evidence-title" className="marketing-h1">
            {evidence.title}
          </h2>
          <p className="marketing-lead">{evidence.lead}</p>
          <AudienceChips sectionId="evidence" />

          <ul
            style={{
              listStyle: 'none',
              display: 'grid',
              gap: '0.6rem',
              marginTop: '1.75rem',
              fontFamily: 'var(--marketing-mono)',
              fontSize: '11px',
              color: 'var(--marketing-muted)',
            }}
          >
            {[
              ['HASH', 'sha256:8b3a…21fc · canonical bytes'],
              ['SIG', 'ed25519:0x7e…a4 · tenant attestation'],
              ['TIME', '2026-04-30T11:42:18Z · authority NTP'],
              ['LINEAGE', '4 prior records · 1 reversal · 0 redactions'],
              ['POLICY', 'PRC.AP.MATCH.v6 · accepted'],
            ].map(([k, v]) => (
              <li
                key={k}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr',
                  gap: '12px',
                  borderBottom: '1px solid var(--marketing-line)',
                  paddingBottom: '6px',
                }}
              >
                <span style={{ color: 'var(--marketing-cyan)', letterSpacing: '0.18em' }}>{k}</span>
                <span style={{ color: 'var(--marketing-ink)' }}>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <EvidencePack />
      </div>
    </section>
  );
}
