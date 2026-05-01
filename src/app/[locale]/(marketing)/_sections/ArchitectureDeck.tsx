const EXECUTIVE_SURFACES = [
  {
    label: 'Command',
    title: 'Exception radar',
    body: 'Risk, margin, cash, and service posture.',
    functions: ['Prioritise', 'Escalate', 'Explain'],
  },
  {
    label: 'Control',
    title: 'Authority graph',
    body: 'Who can move what, and under which policy.',
    functions: ['Authorize', 'Constrain', 'Revoke'],
  },
  {
    label: 'Workflow',
    title: 'Truth routing',
    body: 'Approvals bound to evidence, not email.',
    functions: ['Assign', 'Approve', 'Resolve'],
  },
  {
    label: 'Ingress',
    title: 'System fabric',
    body: 'ERP, bank, logistics, and work streams.',
    functions: ['Normalize', 'Validate', 'Bind'],
  },
] as const;

const CANON_SERVICES = [
  {
    label: 'Policy spine',
    title: 'Operating rules',
    body: 'Authority limits, fiscal controls, and purpose boundaries resolve before execution.',
    functions: ['RBAC/ABAC', 'Purpose', 'Thresholds'],
  },
  {
    label: 'Ontology resolver',
    title: 'Business object graph',
    body: 'Supplier, invoice, item, payment, and shipment resolve against one shared model.',
    functions: ['Identity', 'State', 'Links'],
  },
  {
    label: 'Evidence spine',
    title: 'Cryptographic ledger',
    body: 'Attribution, hash, signature, and lineage commit at action time.',
    functions: ['Hash', 'Sign', 'Replay'],
  },
  {
    label: 'Action executor',
    title: 'Controlled writeback',
    body: 'Approved decisions execute into systems with rollback and settlement evidence.',
    functions: ['Commit', 'Sync', 'Compensate'],
  },
] as const;

const OPERATING_SUBSTRATE = [
  {
    label: 'Business events',
    title: 'Source streams',
    functions: ['PO', 'GR/SES', 'Invoice'],
  },
  {
    label: 'Ontology',
    title: 'Entity graph',
    functions: ['Supplier', 'Item', 'Payment'],
  },
  {
    label: 'Decision models',
    title: 'Policy math',
    functions: ['Tolerance', 'Risk', 'Cash'],
  },
  {
    label: 'Continuity',
    title: 'Lineage state',
    functions: ['Version', 'Audit', 'Retention'],
  },
] as const;

function FunctionPills({ items }: { items: readonly string[] }) {
  return (
    <div className="architecture-stack__functions" aria-label="Functions">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function LayerDecor({ tone }: { tone: 'surface' | 'core' | 'substrate' }) {
  return (
    <div className={`architecture-stack__decor architecture-stack__decor--${tone}`} aria-hidden="true">
      <span className="architecture-stack__rail architecture-stack__rail--top" />
      <span className="architecture-stack__rail architecture-stack__rail--right" />
      <span className="architecture-stack__rail architecture-stack__rail--bottom" />
      <span className="architecture-stack__rail architecture-stack__rail--left" />
      <span className="architecture-stack__bus architecture-stack__bus--north" />
      <span className="architecture-stack__bus architecture-stack__bus--south" />
      <span className="architecture-stack__ports architecture-stack__ports--left">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="architecture-stack__ports architecture-stack__ports--right">
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

export function ArchitectureDeck() {
  return (
    <div className="architecture-stack" aria-label="Governed architecture stack">
      <div className="architecture-stack__caption">
        <span className="marketing-mono-strong">Resolved record · platform proof</span>
        <span className="marketing-mono">Same route, deeper stack</span>
      </div>

      <div className="architecture-stack__scene">
        <svg
          className="architecture-stack__ribbons"
          viewBox="0 0 1200 940"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="architectureRibbon" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0%" stopColor="rgba(99, 230, 168, 0)" />
              <stop offset="50%" stopColor="rgba(99, 230, 168, 0.56)" />
              <stop offset="100%" stopColor="rgba(127, 217, 255, 0)" />
            </linearGradient>
          </defs>
          <path d="M 320 820 C 352 690, 404 570, 470 470" />
          <path d="M 450 850 C 470 710, 520 590, 545 470" />
          <path d="M 600 860 C 600 720, 600 590, 600 470" />
          <path d="M 750 850 C 730 710, 680 590, 655 470" />
          <path d="M 880 820 C 848 690, 796 570, 730 470" />
        </svg>

        <div className="architecture-stack__envelope" aria-hidden="true">
          <span>Control plane</span>
          <span>Data plane</span>
          <span>Evidence plane</span>
        </div>

        <div className="architecture-stack__decks">
          <section className="architecture-stack__deck architecture-stack__deck--top" aria-label="Executive surfaces">
            <LayerDecor tone="surface" />
            <span className="architecture-stack__deck-label">01 · Executive surfaces</span>
            <p className="architecture-stack__layer-note">Human operating layer · compact views over governed state</p>
            <div className="architecture-stack__mechanics" aria-hidden="true">
              <span className="architecture-stack__mechanic-rail architecture-stack__mechanic-rail--primary" />
              <span className="architecture-stack__mechanic-rail architecture-stack__mechanic-rail--secondary" />
              <span className="architecture-stack__mechanic-runner architecture-stack__mechanic-runner--left" />
              <span className="architecture-stack__mechanic-runner architecture-stack__mechanic-runner--right" />
              <span className="architecture-stack__mechanic-joint is-a" />
              <span className="architecture-stack__mechanic-joint is-b" />
              <span className="architecture-stack__mechanic-joint is-c" />
              <span className="architecture-stack__mechanic-joint is-d" />
              <span className="architecture-stack__mechanic-readout is-left">Policy bus</span>
              <span className="architecture-stack__mechanic-readout is-right">Action relay</span>
            </div>
            <div className="architecture-stack__surface-grid">
              {EXECUTIVE_SURFACES.map((surface) => (
                <article key={surface.label} className="architecture-stack__surface">
                  <span>{surface.label}</span>
                  <strong>{surface.title}</strong>
                  <p>{surface.body}</p>
                  <FunctionPills items={surface.functions} />
                </article>
              ))}
            </div>
          </section>

          <section className="architecture-stack__deck architecture-stack__deck--core" aria-label="Canon engine">
            <LayerDecor tone="core" />
            <span className="architecture-stack__deck-label">02 · Canon engine</span>
            <div className="architecture-stack__core-services architecture-stack__core-services--left">
              {CANON_SERVICES.slice(0, 2).map((service) => (
                <article key={service.label} className="architecture-stack__spine">
                  <span>{service.label}</span>
                  <strong>{service.title}</strong>
                  <p>{service.body}</p>
                  <FunctionPills items={service.functions} />
                </article>
              ))}
            </div>
            <div className="architecture-stack__record" aria-label="Canonical record resolved">
              <span>Canonical record</span>
              <strong>CR-7831</strong>
              <em>Policy + evidence + state</em>
              <dl>
                <div>
                  <dt>Authority</dt>
                  <dd>Verified</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>Sealed</dd>
                </div>
                <div>
                  <dt>Lineage</dt>
                  <dd>Replayable</dd>
                </div>
              </dl>
            </div>
            <div className="architecture-stack__core-services architecture-stack__core-services--right">
              {CANON_SERVICES.slice(2).map((service) => (
                <article key={service.label} className="architecture-stack__spine">
                  <span>{service.label}</span>
                  <strong>{service.title}</strong>
                  <p>{service.body}</p>
                  <FunctionPills items={service.functions} />
                </article>
              ))}
            </div>
          </section>

          <section
            className="architecture-stack__deck architecture-stack__deck--bottom"
            aria-label="Operating substrate"
          >
            <LayerDecor tone="substrate" />
            <span className="architecture-stack__deck-label">03 · Operating substrate</span>
            <p className="architecture-stack__layer-note">Machine layer · events, models, writebacks, and memory</p>
            <div className="architecture-stack__substrate-grid">
              {OPERATING_SUBSTRATE.map((item) => (
                <article key={item.label} className="architecture-stack__substrate">
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <FunctionPills items={item.functions} />
                  <div aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
