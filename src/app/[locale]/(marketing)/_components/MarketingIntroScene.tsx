'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MarketingIntroDiagram = dynamic(
  () => import('./MarketingIntroDiagram').then((m) => ({ default: m.MarketingIntroDiagram })),
  { ssr: false },
);

const SESSION_FLAG = 'afenda_intro_seen';
const LYNX_PHASE_MS = 2_800;
const DIAGRAM_PHASE_MS = 5_200;
const INTRO_TOTAL_MS = LYNX_PHASE_MS + DIAGRAM_PHASE_MS;
const DIAGRAM_RESOLVE_MS = 3_800;
const DIAGRAM_DWELL_MS = DIAGRAM_PHASE_MS - DIAGRAM_RESOLVE_MS;
const IDLE_RESUME_MS = 1_500;

type IntroPhase = 'lynx' | 'diagram';

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;

  const params = new URLSearchParams(window.location.search);
  if (params.get('intro') === '1') return false;
  if (params.get('intro') === '0') return true;

  if (window.matchMedia('(max-width: 68.75rem)').matches) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.location.hash !== '') return true;

  try {
    if (sessionStorage.getItem(SESSION_FLAG) === '1') return true;
  } catch {
    return true;
  }

  return false;
}

function LynxIntroPhase() {
  return (
    <div className="marketing-intro-scene__lynx-phase">
      <Image
        src="/brand/afenda/afenda-lynx-intro.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="marketing-intro-scene__lynx-image"
      />

      <div className="marketing-intro-scene__lynx-veil" aria-hidden="true" />
      <div className="marketing-intro-scene__lynx-grain" aria-hidden="true" />

      <div className="marketing-intro-scene__status" aria-live="polite">
        <p className="marketing-intro-scene__status-kicker">AFENDA / THE MACHINE</p>
        <p className="marketing-intro-scene__status-primary">Resolving operating field</p>
        <p className="marketing-intro-scene__status-sequence">Identity / Authority / Policy / Evidence / State</p>
        <span className="marketing-intro-scene__progress" aria-hidden="true" />
      </div>
    </div>
  );
}

function TruthResolutionIntroPhase({ resolveMs, dwellMs }: { resolveMs: number; dwellMs: number }) {
  return (
    <div
      className="marketing-intro-scene__diagram-phase"
      style={
        {
          '--diagram-resolve-ms': `${resolveMs}ms`,
          '--diagram-dwell-ms': `${dwellMs}ms`,
        } as CSSProperties
      }
      aria-label="Operational truth graph"
    >
      <MarketingIntroDiagram />
    </div>
  );
}

export function MarketingIntroScene() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<IntroPhase>('lynx');
  const dismissed = useRef(false);
  const phaseRef = useRef<IntroPhase>('lynx');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(LYNX_PHASE_MS);
  const phaseStartRef = useRef(0);
  const pausedRef = useRef(false);

  const setIntroPhase = (nextPhase: IntroPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    timerRef.current = null;
    idleTimerRef.current = null;
  };

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    clearTimers();

    try {
      sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {
      // ignore unavailable storage
    }

    document.body.style.overflow = '';
    document.querySelector('.marketing-root')?.removeAttribute('data-intro-active');

    const chrome = document.querySelector('.marketing-shell__chrome');
    if (chrome) {
      chrome.removeAttribute('inert');
      chrome.removeAttribute('aria-hidden');
    }

    setVisible(false);

    requestAnimationFrame(() => {
      const title = document.getElementById('marketing-hero-title');
      title?.focus({ preventScroll: true });
    });
  };

  const advance = () => {
    if (phaseRef.current === 'lynx') {
      setIntroPhase('diagram');
      remainingRef.current = DIAGRAM_PHASE_MS;
      phaseStartRef.current = Date.now();
      timerRef.current = setTimeout(dismiss, DIAGRAM_PHASE_MS);
      return;
    }

    dismiss();
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
    timerRef.current = setTimeout(advance, Math.max(0, remainingRef.current));
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

    document.body.style.overflow = 'hidden';
    document.querySelector('.marketing-root')?.setAttribute('data-intro-active', '1');

    const chrome = document.querySelector('.marketing-shell__chrome');
    if (chrome) {
      chrome.setAttribute('inert', '');
      chrome.setAttribute('aria-hidden', 'true');
    }

    setVisible(true);
    setIntroPhase('lynx');
    remainingRef.current = LYNX_PHASE_MS;
    phaseStartRef.current = Date.now();
    timerRef.current = setTimeout(advance, LYNX_PHASE_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        dismiss();
        return;
      }

      handleInteraction();
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      clearTimers();
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.body.style.overflow = '';
      document.querySelector('.marketing-root')?.removeAttribute('data-intro-active');

      const chromeEl = document.querySelector('.marketing-shell__chrome');
      if (chromeEl) {
        chromeEl.removeAttribute('inert');
        chromeEl.removeAttribute('aria-hidden');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <section
      className="marketing-intro-scene"
      data-phase={phase}
      aria-label="Afenda intro scene"
      onPointerMove={handleInteraction}
      onWheel={handleInteraction}
      style={
        {
          '--intro-total-ms': `${INTRO_TOTAL_MS}ms`,
          '--lynx-phase-ms': `${LYNX_PHASE_MS}ms`,
        } as CSSProperties
      }
    >
      {phase === 'lynx' ? (
        <LynxIntroPhase />
      ) : (
        <TruthResolutionIntroPhase resolveMs={DIAGRAM_RESOLVE_MS} dwellMs={DIAGRAM_DWELL_MS} />
      )}

      <button type="button" className="marketing-intro-scene__skip" onClick={dismiss}>
        Skip intro
      </button>
    </section>
  );
}
