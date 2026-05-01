import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { ExplorerSummary } from '../_components/ExplorerSummary';
import { modular } from '../_content/sections';

export function ModularSection() {
  return (
    <section id="modular" className="marketing-section marketing-section--tall" aria-labelledby="modular-title">
      <div className="marketing-frame">
        <div>
          <p className="marketing-eyebrow">Section 09 · Build on the spine</p>
          <h2 id="modular-title" className="marketing-h1">
            {modular.title}
          </h2>
          <p className="marketing-lead">{modular.lead}</p>
          <AudienceChips sectionId="modular" />

          <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem', marginTop: '1.75rem' }}>
            {[
              ['SDK', 'TypeScript-first; types follow the ontology'],
              ['API', 'gRPC + REST; stable contracts; semver guarantees'],
              ['Container', 'Run logic in tenant scope, no data exfil'],
              ['Federation', 'Cross-tenant truth without copy'],
              ['Custom functions', 'Pure functions over the object graph'],
              ['Actions', 'Bound to policy and evidence'],
            ].map(([k, v]) => (
              <li
                key={k}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--marketing-line)',
                }}
              >
                <span className="marketing-mono-strong" style={{ color: 'var(--marketing-violet)' }}>
                  {k}
                </span>
                <span style={{ color: 'var(--marketing-muted)', fontSize: '0.92rem' }}>{v}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1.5rem' }}>
            <DeepDiveTrigger explorerId="modular" label="Open SDK playground" />
          </div>
        </div>

        <div className="marketing-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '0.7rem 0.9rem',
              borderBottom: '1px solid var(--marketing-line)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--marketing-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--marketing-dim)',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--marketing-red)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--marketing-amber)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--marketing-green)' }} />
            <span style={{ marginLeft: 12 }}>resolve.ts · @afenda/sdk</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '1.25rem 1.25rem 1.5rem',
              fontFamily: 'var(--marketing-mono)',
              fontSize: 12,
              lineHeight: 1.7,
              color: 'var(--marketing-ink)',
              background: 'transparent',
              overflowX: 'auto',
            }}
          >
            {`import { afenda } from "@afenda/sdk";

const record = await afenda.resolve({
  tenant:   "acme",
  object:   "Invoice",
  id:       "INV-2044",
  evidence: true,
});

// → { id, hash, lineage, signed_by, policy }`}
          </pre>
          <div
            style={{ borderTop: '1px solid var(--marketing-line)', padding: '0.75rem 1rem', display: 'flex', gap: 16 }}
          >
            <span className="marketing-mono">
              <span className="marketing-dot marketing-dot--ok" />
              200 OK
            </span>
            <span className="marketing-mono">42 ms</span>
            <span className="marketing-mono">tenant=acme</span>
            <span className="marketing-mono">purpose=AUDIT.READ</span>
          </div>
        </div>
      </div>

      <ExplorerSummary
        explorerId="modular"
        bullets={[
          'SDK · API · container · federation · custom functions · actions',
          'Types follow the ontology; semver guarantees on contracts',
          'Tenant-scoped containers — logic runs without data exfil',
          'Playground in the explorer; static surface here',
        ]}
      />
    </section>
  );
}
