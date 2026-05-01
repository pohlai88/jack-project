'use client';

import type { ComponentType } from 'react';

import { cn } from '@/shared/lib/utils';

import { landingKickerTw, landingSectionTitleTw } from './landing-primitives';

interface LandingSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  titleId?: string;
  className?: string;
}

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  icon: Icon,
  titleId,
  className,
}: LandingSectionHeaderProps) {
  return (
    <header
      className={cn(
        'max-w-5xl afenda-motion-sequence',
        align === 'center' ? 'mx-auto text-center' : 'mx-0 text-left',
        className,
      )}
    >
      {eyebrow && (
        <div className={cn(landingKickerTw, 'mb-6', align === 'center' && 'justify-center')}>
          {Icon && <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden />}
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 id={titleId} className={cn(landingSectionTitleTw, 'max-w-4xl', align === 'center' && 'mx-auto')}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
      <div className={cn('mt-10 h-px bg-border', align === 'center' ? 'mx-auto w-24' : 'w-16')} aria-hidden />
    </header>
  );
}
