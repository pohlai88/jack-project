import type { ElementType, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

/** Tailwind composites for landing surfaces — no legacy `landing-*` CSS helpers */
export const landingKickerTw = 'landing-label';

export const landingPanelSurfaceTw = 'landing-panel';

export const landingEditorialCopyTw = 'landing-section__copy';

export const landingEditorialQuoteTw = 'landing-section__quote';

export const landingStatusPillTw = 'landing-status-pill';

export const landingPanelHeaderRowTw = 'landing-panel__header';

export const landingEditorialIndexTw = 'landing-meta-label';

export const landingEditorialTimelineTw = 'landing-timeline';

export const landingEditorialDotTw = 'landing-timeline__dot';

export const landingSectionTitleTw = 'landing-section__title';

export const landingLargeBodyTw = 'landing-large-body';

type LandingSectionTone = 'default' | 'muted';

interface LandingSectionProps {
  children: ReactNode;
  id?: string;
  titleId?: string;
  tone?: LandingSectionTone;
  compact?: boolean;
  className?: string;
  containerClassName?: string;
}

export function LandingSection({
  children,
  id,
  titleId,
  tone = 'default',
  compact = false,
  className,
  containerClassName,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'landing-section',
        compact && 'landing-section--compact',
        tone === 'muted' && 'landing-section--muted',
        className,
      )}
      aria-labelledby={titleId}
    >
      <div className={cn('landing-section__inner', containerClassName)}>{children}</div>
    </section>
  );
}

interface LandingKickerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function LandingKicker({ children, as: Component = 'p', className }: LandingKickerProps) {
  return <Component className={cn(landingKickerTw, className)}>{children}</Component>;
}

interface LandingSectionHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleId?: string;
  quote?: ReactNode;
  className?: string;
}

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  titleId,
  quote,
  className,
}: LandingSectionHeaderProps) {
  return (
    <div className={cn('landing-section__header', className)}>
      <LandingKicker>{eyebrow}</LandingKicker>

      <h2 id={titleId} className={landingSectionTitleTw}>
        {title}
      </h2>

      {description ? <p className={cn(landingEditorialCopyTw, 'mt-7')}>{description}</p> : null}

      {quote ? <blockquote className={landingEditorialQuoteTw}>{quote}</blockquote> : null}
    </div>
  );
}

interface LandingPanelProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  ariaLabel?: string;
}

export function LandingPanel({ children, as: Component = 'div', className, ariaLabel }: LandingPanelProps) {
  return (
    <Component className={cn(landingPanelSurfaceTw, className)} aria-label={ariaLabel}>
      {children}
    </Component>
  );
}

interface LandingCtaRowProps {
  children: ReactNode;
  className?: string;
}

export function LandingCtaRow({ children, className }: LandingCtaRowProps) {
  return <div className={cn('landing-cta-row', className)}>{children}</div>;
}
