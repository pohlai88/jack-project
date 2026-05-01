'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { AppLogo } from '@/shared/components/brand/Logo';

const MarketingIntroDiagram = dynamic(
  () => import('./MarketingIntroDiagram').then((m) => ({ default: m.MarketingIntroDiagram })),
  { ssr: false },
);

const SESSION_FLAG = 'afenda_intro_seen';
const LOGO_PHASE_MS = 1200;
const DIAGRAM_PHASE_MS = 6000;
const IDLE_RESUME_MS = 1500;

type Phase = 'logo' | 'diagram';

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;

  // URL param overrides: ?intro=1 forces, ?intro=0 blocks
  const params = new URLSearchParams(window.location.search);
  if (params.get('intro') === '1') return false;
  if (params.get('intro') === '0') return true;

  // Skip on mobile (dedicated mobile version handles its own splash)
  if (window.matchMedia('(max-width: 68.75rem)').matches) return true;

  // Skip when user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

  // Skip on deep links (non-empty hash means user navigated to a section)
  if (window.location.hash !== '') return true;

  // Skip if already seen this session
  try {
    if (sessionStorage.getItem(SESSION_FLAG) === '1') return true;
  } catch {
    // sessionStorage unavailable — skip safely
    return true;
  }

  return false;
}

export function MarketingPreLanding() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('logo');
  const dismissed = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(LOGO_PHASE_MS);
  const phaseStartRef = useRef(0);
  const pausedRef = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    // Mark session so intro won't show again
    try {
      sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {
      // ignore
    }

    // Restore body scroll and remove intro gate
    document.body.style.overflow = '';
    delete document.body.dataset.introActive;

    // Remove inert from main
    const main = document.querySelector('main');
    if (main) {
      main.removeAttribute('inert');
      main.removeAttribute('aria-hidden');
    }

    setVisible(false);

    // Restore focus to title
    requestAnimationFrame(() => {
      const title = document.getElementById('marketing-hero-title');
      title?.focus({ preventScroll: true });
    });
  };

  const pauseTimer = () => {
    if (pausedRef.current || dismissed.current) return;
    pausedRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - phaseStartRef.current;
    }
  };

  const resumeTimer = () => {
    if (!pausedRef.current || dismissed.current) return;
    pausedRef.current = false;
    phaseStartRef.current = Date.now();

    timerRef.current = setTimeout(
      () => {
        if (phase === 'logo') {
          setPhase('diagram');
          remainingRef.current = DIAGRAM_PHASE_MS;
          phaseStartRef.current = Date.now();
          timerRef.current = setTimeout(dismiss, DIAGRAM_PHASE_MS);
        } else {
          dismiss();
        }
      },
      Math.max(0, remainingRef.current),
    );
  };

  const scheduleIdleResume = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(resumeTimer, IDLE_RESUME_MS);
  };

  const handleInteraction = () => {
    if (dismissed.current) return;
    pauseTimer();
    scheduleIdleResume();
  };

  useEffect(() => {
    if (shouldSkipIntro()) return;

    // Lock body scroll and suppress truth instruments
    document.body.style.overflow = 'hidden';
    document.body.dataset.introActive = '1';

    // Gate main content from keyboard/AT while overlay is visible
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('inert', '');
      main.setAttribute('aria-hidden', 'true');
    }

    setVisible(true);

    // Start logo phase timer
    remainingRef.current = LOGO_PHASE_MS;
    phaseStartRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      setPhase('diagram');
      remainingRef.current = DIAGRAM_PHASE_MS;
      phaseStartRef.current = Date.now();
      timerRef.current = setTimeout(dismiss, DIAGRAM_PHASE_MS);
    }, LOGO_PHASE_MS);

    // Esc key — capture phase so it wins over dialogs
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dismiss();
      } else {
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown, { capture: true });

      // Clean up if component unmounts before dismiss
      document.body.style.overflow = '';
      delete document.body.dataset.introActive;
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.removeAttribute('inert');
        mainEl.removeAttribute('aria-hidden');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      className="marketing-pre-landing"
      role="dialog"
      aria-modal="true"
      aria-label="Afenda introduction sequence"
      onPointerMove={handleInteraction}
      onWheel={handleInteraction}
    >
      {phase === 'logo' ? (
        <div className="marketing-pre-landing__phase" aria-label="Afenda brand mark">
          <div className="marketing-pre-landing__logo-wrap">
            <AppLogo
              placement="splash"
              size="xl"
              href={null}
              showText={false}
              allowTenantLogo={false}
              ariaLabel="Afenda"
            />
            <AppLogo
              placement="nav"
              size="md"
              href={null}
              showText={true}
              allowTenantLogo={false}
              className="marketing-pre-landing__wordmark"
              tagline="Operational truth engine"
            />
          </div>
        </div>
      ) : (
        <div className="marketing-pre-landing__phase" aria-label="Operational truth graph">
          <MarketingIntroDiagram />
        </div>
      )}

      <button type="button" className="marketing-pre-landing__skip" onClick={dismiss} aria-label="Skip introduction">
        <kbd>Esc</kbd>
        <span>Skip</span>
      </button>
    </div>
  );
}
