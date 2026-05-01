'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import { cn } from '@/shared/lib/utils';
import { useTenantOptional } from '@/shared/providers/tenant-provider';
import { AfendaIcon, type AfendaIconSize, type AfendaIconVariant } from './AfendaIcon';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type AppLogoPlacement = 'nav' | 'sidebar' | 'footer' | 'auth' | 'tenant-login' | 'favicon' | 'error' | 'splash';

interface AppLogoProps {
  size?: LogoSize;
  placement?: AppLogoPlacement;
  surface?: 'auto' | 'light' | 'dark';
  showText?: boolean;
  allowTenantLogo?: boolean;
  priority?: boolean;
  href?: string | null;
  className?: string;
  ariaLabel?: string;
  logoUrl?: string | null;
  displayName?: string | null;
  tagline?: string | null;
}

const sizeConfig: Record<
  LogoSize,
  { icon: string; markSize: AfendaIconSize; textMain: string; textSub: string; imgSize: number }
> = {
  sm: { icon: 'h-6 w-6', markSize: 'sm', textMain: 'text-base', textSub: 'text-base', imgSize: 24 },
  md: { icon: 'h-8 w-8', markSize: 'md', textMain: 'text-lg', textSub: 'text-lg', imgSize: 32 },
  lg: { icon: 'h-12 w-12', markSize: 'lg', textMain: 'text-2xl', textSub: 'text-2xl', imgSize: 48 },
  xl: { icon: 'h-16 w-16', markSize: 'xl', textMain: 'text-2xl', textSub: 'text-2xl', imgSize: 64 },
};

const placementConfig: Record<
  AppLogoPlacement,
  {
    renderMode: 'mark' | 'combinedLockup';
    fallbackSize: LogoSize;
    markSize: AfendaIconSize;
    variant: AfendaIconVariant;
    darkVariant?: AfendaIconVariant;
    lockupLightSrc?: string;
    lockupDarkSrc?: string;
    lockupClassName?: string;
    darkLockupClassName?: string;
    textClass: string;
    markClassName: string;
    darkMarkClassName?: string;
    tenantLogoClassName: string;
  }
> = {
  nav: {
    renderMode: 'combinedLockup',
    fallbackSize: 'md',
    markSize: 'md',
    variant: 'inline',
    darkVariant: 'inlineDark',
    lockupLightSrc: '/brand/afenda/afenda-combined-lockup-transparent.svg',
    lockupDarkSrc: '/brand/afenda/afenda-combined-lockup-inline-dark.svg',
    lockupClassName: 'transition-transform duration-300 group-hover:scale-[1.01]',
    darkLockupClassName: 'transition-transform duration-300 group-hover:scale-[1.01]',
    textClass: 'brand-gradient-text',
    markClassName: 'transition-transform duration-300 group-hover:scale-105',
    darkMarkClassName: 'transition-transform duration-300 group-hover:scale-105',
    tenantLogoClassName: 'max-h-8 max-w-[8rem]',
  },
  sidebar: {
    renderMode: 'mark',
    fallbackSize: 'md',
    markSize: 'md',
    variant: 'inline',
    darkVariant: 'inlineDark',
    textClass: 'brand-gradient-text',
    markClassName: 'transition-transform duration-300 group-hover:scale-105',
    darkMarkClassName: 'transition-transform duration-300 group-hover:scale-105',
    tenantLogoClassName: 'max-h-8 max-w-8',
  },
  footer: {
    renderMode: 'combinedLockup',
    fallbackSize: 'sm',
    markSize: 'sm',
    variant: 'inline',
    darkVariant: 'inlineDark',
    lockupLightSrc: '/brand/afenda/afenda-combined-lockup-transparent.svg',
    lockupDarkSrc: '/brand/afenda/afenda-combined-lockup-inline-dark.svg',
    lockupClassName: '',
    darkLockupClassName: '',
    textClass: 'brand-gradient-text',
    markClassName: '',
    darkMarkClassName: '',
    tenantLogoClassName: 'max-h-6 max-w-[7rem]',
  },
  auth: {
    renderMode: 'mark',
    fallbackSize: 'lg',
    markSize: 'xl',
    variant: 'appTileLight',
    darkVariant: 'appTileDark',
    textClass: 'brand-gradient-text',
    markClassName: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    darkMarkClassName: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    tenantLogoClassName: 'max-h-16 max-w-[12rem]',
  },
  'tenant-login': {
    renderMode: 'mark',
    fallbackSize: 'lg',
    markSize: 'xl',
    variant: 'appTileLight',
    darkVariant: 'appTileDark',
    textClass: 'brand-gradient-text',
    markClassName: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    darkMarkClassName: 'drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]',
    tenantLogoClassName: 'max-h-16 max-w-[12rem]',
  },
  favicon: {
    renderMode: 'mark',
    fallbackSize: 'lg',
    markSize: 'xl',
    variant: 'appTileGradient',
    textClass: 'brand-gradient-text',
    markClassName: '',
    tenantLogoClassName: 'max-h-16 max-w-16',
  },
  error: {
    renderMode: 'mark',
    fallbackSize: 'lg',
    markSize: 'xl',
    variant: 'monoBlack',
    darkVariant: 'monoWhite',
    textClass: 'text-foreground',
    markClassName: 'rounded-2xl',
    darkMarkClassName: 'rounded-2xl',
    tenantLogoClassName: 'max-h-16 max-w-[12rem]',
  },
  splash: {
    renderMode: 'mark',
    fallbackSize: 'xl',
    markSize: 'hero',
    variant: 'fullColor',
    textClass: 'text-white/80',
    markClassName: 'marketing-pre-landing__icon',
    tenantLogoClassName: 'max-h-32 max-w-[16rem]',
  },
};

/**
 * App Logo — renders tenant custom logo or default app brand.
 * If the tenant has a custom logoUrl configured, it renders that instead.
 */
export function AppLogo({
  size,
  placement = 'nav',
  surface = 'auto',
  showText = true,
  allowTenantLogo = true,
  priority = false,
  href = '/',
  className,
  ariaLabel,
  logoUrl: logoUrlProp,
  displayName: displayNameProp,
  tagline,
}: AppLogoProps) {
  const tenant = useTenantOptional();
  const placementStyle = placementConfig[placement];
  const resolvedSize = size ?? placementStyle.fallbackSize;
  const s = sizeConfig[resolvedSize];
  const lockupWidth = Math.round((s.imgSize * 1800) / 488);
  const tenantLogoUrl = allowTenantLogo ? tenant?.settings?.ui?.logoUrl : null;
  const logoUrl = logoUrlProp ?? tenantLogoUrl;
  const displayName = displayNameProp ?? tenant?.settings?.ui?.displayName ?? tenant?.name ?? 'Afenda';
  const renderAssetWordmark = placementStyle.renderMode === 'combinedLockup';
  const shouldConstrainTenantIcon =
    !showText && (placement === 'nav' || placement === 'sidebar' || placement === 'footer');
  const tenantLogoBoxClassName = shouldConstrainTenantIcon ? s.icon : 'min-h-0 min-w-0';
  const shouldRenderText = showText && !renderAssetWordmark;
  const shouldForceDarkSurface = surface === 'dark';
  const shouldForceLightSurface = surface === 'light';
  const shouldRenderLightAsset = !shouldForceDarkSurface;
  const shouldRenderDarkAsset = Boolean(placementStyle.lockupDarkSrc) && !shouldForceLightSurface;
  const lightAssetClassName =
    placementStyle.lockupDarkSrc && !shouldForceLightSurface ? 'afenda-theme-light' : undefined;
  const darkAssetClassName = shouldForceDarkSurface || shouldForceLightSurface ? undefined : 'afenda-theme-dark';
  const lightMarkClassName = placementStyle.darkVariant && !shouldForceLightSurface ? 'afenda-theme-light' : undefined;
  const darkMarkClassName = shouldForceDarkSurface || shouldForceLightSurface ? undefined : 'afenda-theme-dark';

  const content = (
    <>
      {logoUrl ? (
        <div className={cn('flex items-center justify-center overflow-hidden', tenantLogoBoxClassName)}>
          <Image
            src={logoUrl}
            alt={displayName}
            width={s.imgSize * 4}
            height={s.imgSize * 4}
            className={cn('h-auto w-auto object-contain', placementStyle.tenantLogoClassName)}
            priority={priority}
            unoptimized
          />
        </div>
      ) : placementStyle.renderMode === 'combinedLockup' && placementStyle.lockupLightSrc ? (
        placement === 'footer' ? (
          <>
            {shouldRenderLightAsset ? (
              <Image
                src={placementStyle.lockupLightSrc}
                alt={displayName}
                width={lockupWidth}
                height={s.imgSize}
                className={cn(
                  'h-auto w-auto shrink-0 object-contain',
                  lightAssetClassName,
                  placementStyle.lockupClassName,
                )}
                priority={priority}
                unoptimized
              />
            ) : shouldRenderDarkAsset && placementStyle.lockupDarkSrc ? (
              <Image
                src={placementStyle.lockupDarkSrc}
                alt={displayName}
                width={lockupWidth}
                height={s.imgSize}
                className={cn(
                  'h-auto w-auto shrink-0 object-contain',
                  darkAssetClassName,
                  placementStyle.darkLockupClassName,
                )}
                priority={priority}
                unoptimized
              />
            ) : null}
          </>
        ) : (
          <>
            {shouldRenderLightAsset ? (
              <Image
                src={placementStyle.lockupLightSrc}
                alt={displayName}
                width={lockupWidth}
                height={s.imgSize}
                className={cn(
                  'h-auto w-auto shrink-0 object-contain',
                  lightAssetClassName,
                  placementStyle.lockupClassName,
                )}
                priority={priority}
                unoptimized
              />
            ) : null}
            {shouldRenderDarkAsset && placementStyle.lockupDarkSrc ? (
              <Image
                src={placementStyle.lockupDarkSrc}
                alt={displayName}
                width={lockupWidth}
                height={s.imgSize}
                className={cn(
                  'h-auto w-auto shrink-0 object-contain',
                  darkAssetClassName,
                  placementStyle.darkLockupClassName,
                )}
                priority={priority}
                unoptimized
              />
            ) : null}
          </>
        )
      ) : (
        <>
          <AfendaIcon
            variant={placementStyle.variant}
            size={placementStyle.markSize}
            decorative={showText}
            alt={showText ? '' : displayName}
            className={cn(placementStyle.markClassName, lightMarkClassName)}
            priority={priority}
          />
          {placementStyle.darkVariant && !shouldForceLightSurface && (
            <AfendaIcon
              variant={placementStyle.darkVariant}
              size={placementStyle.markSize}
              decorative={showText}
              alt={showText ? '' : displayName}
              className={cn(darkMarkClassName, placementStyle.darkMarkClassName)}
              priority={priority}
            />
          )}
        </>
      )}
      {shouldRenderText && (
        <span className={cn('app-logo__text inline-flex min-w-0 flex-col justify-center', tagline ? 'gap-1' : '')}>
          <span className={cn('app-logo__wordmark font-bold leading-none', placementStyle.textClass, s.textMain)}>
            {displayName}
          </span>
          {tagline ? <span className="app-logo__tagline leading-none">{tagline}</span> : null}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn('flex items-center gap-2 group', className)} aria-label={ariaLabel ?? 'Home'}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)} aria-label={ariaLabel}>
      {content}
    </div>
  );
}

// Backward-compat alias for any remaining imports
// Legacy alias for backward compatibility
export { AppLogo as A8nHubLogo };
