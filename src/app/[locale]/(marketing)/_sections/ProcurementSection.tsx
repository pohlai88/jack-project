import { AudienceChips } from '../_components/AudienceChips';
import { DeepDiveTrigger } from '../_components/DeepDiveTrigger';
import { MarketingSection } from '../_components/landing-primitives';
import { procurement } from '../_content/sections';

const MATCH_DOCUMENTS = [
  {
    label: 'PO',
    value: 'PO line baseline',
    detail: 'Item, qty, price',
  },
  {
    label: 'GR / SES',
    value: 'Receipt proof',
    detail: 'Goods or service entry',
  },
  {
    label: 'Invoice',
    value: 'Vendor claim',
    detail: 'Bill, tax, freight',
  },
] as const;

const MATCH_CHECKS = [
  { label: 'Quantity variance', value: 'In band' },
  { label: 'Price variance', value: 'In band' },
  { label: 'GR/IR clearing', value: 'Balanced' },
  { label: 'Invoice block', value: 'Clear' },
] as const;

const MATCH_IFRS = [
  {
    label: 'IAS 2 cost capitalisation',
    value: 'Purchase price, freight, duty, and rebates stay attached to the received item.',
  },
  {
    label: 'Accrual completeness',
    value: 'Received-not-invoiced exposure is visible before period close.',
  },
  {
    label: 'IAS 37 obligation review',
    value: 'Unresolved variance stays in exception posture, not silent payment release.',
  },
] as const;

const MATCH_FEATURES = [
  {
    title: 'Tolerance band',
    body: 'Prevents low-value variance noise from blocking clean spend.',
    useCase: 'Route only material price or quantity drift.',
  },
  {
    title: 'GR/IR clearing',
    body: 'Keeps received-not-invoiced accruals from becoming close risk.',
    useCase: 'Reconcile open receipts before payment run.',
  },
  {
    title: 'Service entry sheet',
    body: 'Proves non-stock work before consulting or repair invoices post.',
    useCase: 'Require acceptance for services without goods receipt.',
  },
  {
    title: 'Invoice block reason',
    body: 'Stops silent overrides by preserving the exact release rationale.',
    useCase: 'Hold AP release until exception ownership is clear.',
  },
] as const;

type MatchDocument = (typeof MATCH_DOCUMENTS)[number];
type MatchCheck = (typeof MATCH_CHECKS)[number];
type MatchIfrs = (typeof MATCH_IFRS)[number];
type MatchFeature = (typeof MATCH_FEATURES)[number];

function MatchDocumentCard({ document }: { document: MatchDocument }) {
  return (
    <article className="procurement-match__document">
      <span>{document.label}</span>
      <strong>{document.value}</strong>
      <em>{document.detail}</em>
    </article>
  );
}

function MatchCheckRow({ check }: { check: MatchCheck }) {
  return (
    <li>
      <span>{check.label}</span>
      <strong>{check.value}</strong>
    </li>
  );
}

function MatchIfrsRow({ item }: { item: MatchIfrs }) {
  return (
    <li>
      <span>{item.label}</span>
      <strong>{item.value}</strong>
    </li>
  );
}

function MatchFeatureCard({ feature }: { feature: MatchFeature }) {
  return (
    <article className="procurement-match__feature">
      <h3>{feature.title}</h3>
      <p>{feature.body}</p>
      <span>Use case: {feature.useCase}</span>
    </article>
  );
}

function MatchControlPanel() {
  return (
    <section className="procurement-match__control" aria-label="Three-way match control">
      <div className="procurement-match__status">
        <span className="procurement-match__eyebrow">3-way match control</span>
        <strong>Clean match</strong>
        <em>PO + GR/SES + invoice aligned</em>
      </div>

      <div className="procurement-match__documents" aria-label="Match documents">
        {MATCH_DOCUMENTS.map((document) => (
          <MatchDocumentCard key={document.label} document={document} />
        ))}
      </div>

      <div className="procurement-match__ifrs">
        <span>IFRS evidence basis</span>
        <ul aria-label="IFRS procurement evidence">
          {MATCH_IFRS.map((item) => (
            <MatchIfrsRow key={item.label} item={item} />
          ))}
        </ul>
      </div>

      <ul className="procurement-match__checks" aria-label="Match checks">
        {MATCH_CHECKS.map((check) => (
          <MatchCheckRow key={check.label} check={check} />
        ))}
      </ul>
    </section>
  );
}

export function ProcurementSection() {
  return (
    <MarketingSection id="procurement" className="marketing-section--tall" aria-labelledby="procurement-title">
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

      <div className="procurement-match">
        <MatchControlPanel />

        <div className="procurement-match__features" aria-label="Procurement match features">
          {MATCH_FEATURES.map((feature) => (
            <MatchFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </MarketingSection>
  );
}
