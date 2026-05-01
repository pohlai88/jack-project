import Image from 'next/image';

import { cn } from '@/shared/lib/utils';

const AFENDA_ICON_ASSETS = {
  inline: '/brand/afenda/afenda-icon-transparent.svg',
  inlineDark: '/brand/afenda/afenda-icon-inline-dark.svg',
  appTileLight: '/brand/afenda/afenda-icon-light-bg.svg',
  appTileDark: '/brand/afenda/afenda-icon-dark-bg.svg',
  appTileGradient: '/brand/afenda/afenda-icon-gradient-bg.svg',
  fullColor: '/brand/afenda/afenda-icon-full-color.svg',
  monoBlack: '/brand/afenda/afenda-icon-mono-black-on-light.svg',
  monoWhite: '/brand/afenda/afenda-icon-mono-white-on-dark.svg',
} as const;

export const AFENDA_ICON_SIZE_PX = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 96,
  app: 128,
  hero: 256,
} as const;

export type AfendaIconVariant = keyof typeof AFENDA_ICON_ASSETS;
export type AfendaIconSize = keyof typeof AFENDA_ICON_SIZE_PX;

interface AfendaIconProps {
  variant?: AfendaIconVariant;
  size?: AfendaIconSize;
  alt?: string;
  decorative?: boolean;
  className?: string;
  priority?: boolean;
}

export function AfendaIcon({
  variant,
  size = 'md',
  alt = 'Afenda',
  decorative = false,
  className,
  priority,
}: AfendaIconProps) {
  const pixels = AFENDA_ICON_SIZE_PX[size];

  return (
    <Image
      src={AFENDA_ICON_ASSETS[variant ?? 'inline']}
      alt={decorative ? '' : alt}
      width={pixels}
      height={pixels}
      className={cn('shrink-0 object-contain', className)}
      priority={priority}
      aria-hidden={decorative || undefined}
      unoptimized
    />
  );
}
