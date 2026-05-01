'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { DataRightsDoctrineEvidenceContract } from '@/governance/data-rights-doctrine.contract';
import { cn } from '@/shared/lib/utils';

import {
  type DataRightsDoctrineKey,
  dataRightsDoctrines,
  DEFAULT_DATA_RIGHTS_DOCTRINE,
  DOCTRINE_ORDER,
} from '../_content/data-rights-declaration-data';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDoctrineProof(fields: readonly string[]) {
  return fields.map((f) => f.replace(/_/g, ' ')).join(' · ');
}

function formatDoctrineEvidence(evidence: DataRightsDoctrineEvidenceContract) {
  return evidence.required ? `Evidence: ${evidence.type} · required` : `Evidence: ${evidence.type} · recommended`;
}

function getPageOffset(element: HTMLElement) {
  return window.scrollY + element.getBoundingClientRect().top;
}

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCompactDataRightsLayout() {
  return window.matchMedia('(max-width: 56rem)').matches;
}

const recordFields = [
  { label: 'Legal entity', value: 'MY-OPS-014', tone: 'visible' },
  { label: 'Actor scope', value: 'AP lead · tenant bound', tone: 'access' },
  { label: 'Person identifier', value: 'masked', tone: 'masked' },
  { label: 'Bank route', value: 'withheld', tone: 'masked' },
  { label: 'Business purpose', value: 'AP_APPROVAL', tone: 'purpose' },
  { label: 'Retention class', value: '90D / bounded', tone: 'retention' },
  { label: 'Delete state', value: 'executable', tone: 'deletion' },
] as const;

const deletionSteps = ['Created', 'Used', 'Retained', 'Eligible', 'Deleted'] as const;

export function DataRightsSpecimenBoard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeKey, setActiveKey] = useState<DataRightsDoctrineKey>(DEFAULT_DATA_RIGHTS_DOCTRINE);

  const activeDoctrine = dataRightsDoctrines[activeKey];

  const updateFromScroll = useCallback(() => {
    const section = sectionRef.current;

    if (!(section instanceof HTMLElement)) return;

    if (isCompactDataRightsLayout()) return;

    const sectionTop = getPageOffset(section);
    const sectionHeight = Math.max(section.offsetHeight, 1);
    const viewportBottom = window.scrollY + window.innerHeight;
    const sectionIsObservable = viewportBottom >= sectionTop && window.scrollY <= sectionTop + sectionHeight;

    if (!sectionIsObservable) {
      setActiveKey(DEFAULT_DATA_RIGHTS_DOCTRINE);
      return;
    }

    const progress = clamp((window.scrollY - sectionTop) / sectionHeight, 0, 0.999);
    const nextIndex = clamp(Math.floor(progress * DOCTRINE_ORDER.length), 0, DOCTRINE_ORDER.length - 1);
    const nextKey = DOCTRINE_ORDER[nextIndex] ?? DEFAULT_DATA_RIGHTS_DOCTRINE;

    setActiveKey((current) => (current === nextKey ? current : nextKey));
  }, []);

  useEffect(() => {
    let frame = 0;

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateFromScroll);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [updateFromScroll]);

  const scrollToDoctrine = useCallback((key: DataRightsDoctrineKey) => {
    const section = sectionRef.current;
    const chapterIndex = DOCTRINE_ORDER.indexOf(key);

    if (!(section instanceof HTMLElement) || chapterIndex < 0) return;

    if (isCompactDataRightsLayout()) {
      setActiveKey(key);
      return;
    }

    const chapterHeight = section.offsetHeight / DOCTRINE_ORDER.length;
    const top = getPageOffset(section) + chapterHeight * chapterIndex;

    setActiveKey(key);
    window.scrollTo({ top, behavior: shouldReduceMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <section
      id="thesis"
      ref={sectionRef}
      className="data-rights"
      data-active={activeKey}
      aria-labelledby="thesis-title"
    >
      <div className="data-rights__sticky">
        <div className="data-rights__copy">
          <p className="marketing-eyebrow">Act I - Declaration</p>
          <h2 id="thesis-title" className="data-rights__headline">
            Designed to protect.
            <span>Designed to forget.</span>
          </h2>
          <p className="data-rights__lead">
            Afenda treats privacy, deletion, and ownership as first-order architecture. Access is narrowed by purpose.
            Exposure is minimised by design. Retention is bounded. Deletion is executable. Tenant data remains sovereign
            throughout its lifecycle.
          </p>
          <div className="data-rights__proofline" aria-label="Data rights proof line">
            <span>0 open visibility</span>
            <span>1 tenant boundary</span>
            <span>deletion by design</span>
          </div>
          <p className="data-rights__doctrine-note">One business record. Six inspection states.</p>
        </div>

        <div className="data-rights__board" aria-label="Data Rights Specimen Board">
          <div className="data-rights__specimen">
            <div className="data-rights__specimen-header">
              <span>Data Rights Specimen</span>
              <span>{activeDoctrine.id}</span>
            </div>

            <div className="data-rights__boundary" aria-label="Tenant boundary active">
              <div className="data-rights__boundary-label">Tenant boundary: active</div>
              <div className="data-rights__record" aria-label="Business record anatomy">
                <div className="data-rights__record-header">
                  <span>Business Record Anatomy</span>
                  <span>{activeDoctrine.specimenLabel}</span>
                </div>
                {recordFields.map((field) => (
                  <div
                    key={field.label}
                    className={cn(
                      'data-rights__field',
                      field.tone === 'masked' && 'data-rights__field--masked',
                      field.tone === 'access' && 'data-rights__field--access',
                      field.tone === 'purpose' && 'data-rights__field--purpose',
                      field.tone === 'retention' && 'data-rights__field--retention',
                      field.tone === 'deletion' && 'data-rights__field--deletion',
                    )}
                  >
                    <span>{field.label}</span>
                    <strong>{field.value}</strong>
                  </div>
                ))}
              </div>

              <div className="data-rights__aperture" aria-hidden="true" />

              <div className="data-rights__retention-band" aria-label="Retention band">
                <span>Retention bounded</span>
                <strong>90D</strong>
              </div>

              <div className="data-rights__deletion-path" aria-label="Deletion lifecycle">
                {deletionSteps.map((step, index) => (
                  <span key={step} className={cn(index === deletionSteps.length - 1 && 'is-final')}>
                    {step}
                  </span>
                ))}
              </div>

              <div className="data-rights__evidence-remnant">
                <span>Evidence remnant</span>
                <strong>audit hash retained</strong>
              </div>
            </div>
          </div>

          <div className="data-rights__scroll-rail" aria-label="Data rights inspection states">
            {DOCTRINE_ORDER.map((key) => {
              const doctrine = dataRightsDoctrines[key];
              const isActive = key === activeKey;

              return (
                <button
                  key={key}
                  type="button"
                  className={cn('data-rights__rail-tick', isActive && 'is-active')}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => scrollToDoctrine(key)}
                >
                  <span>{doctrine.number}</span>
                  {doctrine.label}
                </button>
              );
            })}
          </div>

          <article className="data-rights__readout">
            <p className="data-rights__readout-eyebrow">
              {activeDoctrine.number} {activeDoctrine.label}{' '}
              <span className="sr-only">· enforcement {activeDoctrine.enforcement}</span>
            </p>
            <h3 className="data-rights__readout-title">{activeDoctrine.title}</h3>
            <p className="data-rights__readout-body">{activeDoctrine.summary}</p>
            <p className="data-rights__readout-proof">
              {activeDoctrine.proof.required ? formatDoctrineProof(activeDoctrine.proof.fields) : 'Proof optional'}
            </p>
            <p className="data-rights__readout-evidence" data-evidence-required={activeDoctrine.evidence.required}>
              {formatDoctrineEvidence(activeDoctrine.evidence)}
            </p>
          </article>
        </div>
      </div>

      <div className="data-rights__chapters" aria-hidden="true">
        {DOCTRINE_ORDER.map((key) => (
          <div key={key} className="data-rights__chapter" />
        ))}
      </div>
    </section>
  );
}
