import type { Metadata } from 'next';

import { defaultLocale, locales } from '@/i18n/config';
import { AFENDA_METADATA_IMAGE, AFENDA_METADATA_IMAGE_URL } from '@/shared/components/brand/metadata';

import {
  complianceFooterConfig,
  type ComplianceJurisdictionEvidence,
  formatDisclosureLabel,
} from '../_content/compliance-footer';

const legalDisclosureTitle = 'Legal Disclosure — Afenda';
const legalDisclosureDescription =
  'Malaysia legal anchor and ASEAN disclosure posture: registration, jurisdictional notices, ' +
  'policy summaries, and compliance contacts for Afenda.';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com';
  const canonicalUrl = `${siteUrl}/${locale}/legal-disclosure`;

  const languageAlternates = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/legal-disclosure`])) as Record<
    string,
    string
  >;

  return {
    title: legalDisclosureTitle,
    description: legalDisclosureDescription,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        'x-default': `${siteUrl}/${defaultLocale}/legal-disclosure`,
      },
    },
    openGraph: {
      title: legalDisclosureTitle,
      description: legalDisclosureDescription,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Afenda',
      locale: locale.replace('-', '_'),
      images: [
        {
          ...AFENDA_METADATA_IMAGE,
          alt: legalDisclosureTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: legalDisclosureTitle,
      description: legalDisclosureDescription,
      images: [AFENDA_METADATA_IMAGE_URL],
    },
  };
}

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
            Afenda maintains Malaysia as its legal anchor. Formal Malaysian legal entity details, SSM registration
            number, registered office, and tax/SST information are published here after counsel and accounting
            verification.
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
                <dt>Effective date</dt>
                <dd>{legalIdentity.effectiveDate}</dd>
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
            {jurisdictions.map((jurisdiction) => {
              const evidence = jurisdiction.evidence as ComplianceJurisdictionEvidence | undefined;

              return (
                <article key={jurisdiction.countryCode}>
                  <h3>
                    {jurisdiction.displayName} <span>{jurisdiction.countryCode}</span>
                  </h3>
                  <dl>
                    <div>
                      <dt>Entity status</dt>
                      <dd>{formatDisclosureLabel(jurisdiction.localEntityStatus)}</dd>
                    </div>
                    <div>
                      <dt>Registration posture</dt>
                      <dd>{formatDisclosureLabel(jurisdiction.registrationStatus)}</dd>
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
                      <dd>{formatDisclosureLabel(jurisdiction.privacyStatus)}</dd>
                    </div>
                    <div>
                      <dt>Commerce</dt>
                      <dd>{formatDisclosureLabel(jurisdiction.ecommerceStatus)}</dd>
                    </div>
                    {evidence ? (
                      <div>
                        <dt>Evidence references</dt>
                        <dd>
                          <dl>
                            {evidence.registration ? (
                              <div>
                                <dt>Registration</dt>
                                <dd>{evidence.registration}</dd>
                              </div>
                            ) : null}
                            {evidence.privacy ? (
                              <div>
                                <dt>Privacy</dt>
                                <dd>{evidence.privacy}</dd>
                              </div>
                            ) : null}
                            {evidence.ecommerce ? (
                              <div>
                                <dt>Commerce</dt>
                                <dd>{evidence.ecommerce}</dd>
                              </div>
                            ) : null}
                          </dl>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <p data-prohibits-overclaim={jurisdiction.claimBoundary.prohibitsOverclaim ? 'true' : 'false'}>
                    {jurisdiction.claimBoundary.summary}
                  </p>
                </article>
              );
            })}
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
