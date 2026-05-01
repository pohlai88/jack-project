import { complianceFooterConfig, formatDisclosureStatus } from '../_content/compliance-footer';

const DISCLOSURE_SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy Notice',
    body: 'Privacy notices, rights handling, retention posture, and data protection contact channels are maintained through the privacy desk.',
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    body: 'Cookie and similar technology disclosures are provided where applicable to public website, analytics, and security operations.',
  },
  {
    id: 'dpa',
    title: 'Data Processing Addendum',
    body: 'B2B processing terms, role allocation, transfer safeguards, and jurisdictional annexes are issued through verified contracting workflows.',
  },
  {
    id: 'subprocessors',
    title: 'Subprocessors',
    body: 'Subprocessor disclosures identify service providers used for hosting, support, security, payment, and operational delivery where applicable.',
  },
  {
    id: 'security',
    title: 'Security',
    body: 'Security requests are handled through evidence-based control review. No certification or regulator approval is claimed unless expressly published.',
  },
  {
    id: 'responsible-disclosure',
    title: 'Responsible Disclosure',
    body: 'Good-faith vulnerability reports are triaged through the security contact with coordinated remediation sequencing.',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    body: 'Service access, acceptable use, account responsibilities, support scope, and limitation terms are provided through the legal desk.',
  },
  {
    id: 'service-terms',
    title: 'Service Terms',
    body: 'Service activation, subscription operation, support scope, and fulfilment terms apply to paid digital services where contracted.',
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    body: 'Acceptable use terms govern misuse, unauthorized access, abuse, illegal content, system interference, and security-bypass attempts.',
  },
  {
    id: 'billing',
    title: 'Billing Terms',
    body: 'Billing, invoicing, tax treatment, and renewal language are subject to accounting and contract verification before publication.',
  },
  {
    id: 'refund-cancellation',
    title: 'Refund & Cancellation',
    body: 'Refund, cancellation, subscription renewal, and service termination terms are published where Afenda offers paid plans online.',
  },
  {
    id: 'service-availability',
    title: 'Service Availability',
    body: 'Availability, maintenance, support response, and service-credit terms are governed by the applicable customer agreement.',
  },
  {
    id: 'complaints',
    title: 'Complaints / Dispute Resolution',
    body: 'Complaints are logged through the complaints channel, classified by jurisdiction and subject matter, and escalated where required.',
  },
] as const;

export default function LegalDisclosurePage() {
  const { legalIdentity, contacts, jurisdictions } = complianceFooterConfig;

  return (
    <section className="landing-section legal-disclosure" aria-labelledby="legal-disclosure-title">
      <div className="landing-shell">
        <header className="landing-headline">
          <p className="landing-kicker">Afenda Legal Disclosure</p>
          <h1 id="legal-disclosure-title">Malaysia legal anchor. ASEAN disclosure map.</h1>
          <p>
            Afenda is operated by {legalIdentity.legalName}, a company registered in Malaysia with the{' '}
            {legalIdentity.registrationAuthority} under registration number {legalIdentity.registrationNumber}.
          </p>
          <p>
            Unless expressly stated, Afenda does not claim local incorporation, regulator approval, licensing,
            certification, tax registration, or platform registration outside Malaysia.
          </p>
        </header>

        <div className="landing-panel-grid legal-disclosure__identity">
          <article className="landing-panel">
            <h2>Legal Entity</h2>
            <dl>
              <div>
                <dt>Legal name</dt>
                <dd>{legalIdentity.legalName}</dd>
              </div>
              <div>
                <dt>Registration authority</dt>
                <dd>{legalIdentity.registrationAuthority}</dd>
              </div>
              <div>
                <dt>Registration number</dt>
                <dd>{legalIdentity.registrationNumber}</dd>
              </div>
              <div>
                <dt>Registered office</dt>
                <dd>{legalIdentity.registeredOffice}</dd>
              </div>
              <div>
                <dt>Country of incorporation</dt>
                <dd>{legalIdentity.countryOfIncorporation}</dd>
              </div>
              <div>
                <dt>Tax ID / SST No.</dt>
                <dd>{legalIdentity.taxId}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{legalIdentity.lastUpdated}</dd>
              </div>
            </dl>
          </article>

          <article className="landing-panel">
            <h2>Contact Channels</h2>
            <dl>
              {Object.entries(contacts).map(([label, email]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <a href={`mailto:${email}`}>{email}</a>
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <section className="landing-panel legal-disclosure__jurisdictions" aria-labelledby="jurisdiction-map-title">
          <h2 id="jurisdiction-map-title">Country-Specific Disclosure Posture</h2>
          <div className="legal-disclosure__table">
            {jurisdictions.map((jurisdiction) => (
              <article key={jurisdiction.countryCode}>
                <h3>
                  {jurisdiction.displayName} <span>{jurisdiction.countryCode}</span>
                </h3>
                <dl>
                  <div>
                    <dt>Entity status</dt>
                    <dd>{formatDisclosureStatus(jurisdiction.localEntityStatus)}</dd>
                  </div>
                  <div>
                    <dt>Authority</dt>
                    <dd>{jurisdiction.authorityLabel}</dd>
                  </div>
                  <div>
                    <dt>Reference</dt>
                    <dd>{jurisdiction.publicRegistrationReference}</dd>
                  </div>
                  <div>
                    <dt>Privacy</dt>
                    <dd>{formatDisclosureStatus(jurisdiction.privacyStatus)}</dd>
                  </div>
                  <div>
                    <dt>Commerce</dt>
                    <dd>{formatDisclosureStatus(jurisdiction.ecommerceStatus)}</dd>
                  </div>
                </dl>
                <p>{jurisdiction.claimBoundary}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="landing-grid legal-disclosure__policies">
          {DISCLOSURE_SECTIONS.map((section) => (
            <article key={section.id} id={section.id} className="landing-panel">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
