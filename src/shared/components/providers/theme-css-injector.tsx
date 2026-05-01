'use client';

import { useEffect, useLayoutEffect } from 'react';

import { applyTenantThemeCssVariables, clearTenantThemeCssVariables } from '@/shared/lib/tenant-theme-css';
import { useTenantOptional } from '@/shared/providers/tenant-provider';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function ThemeCSSInjector() {
  const tenant = useTenantOptional();

  useIsomorphicLayoutEffect(() => {
    if (!tenant) return;

    const updateThemeColors = () => {
      const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      applyTenantThemeCssVariables(document.documentElement, tenant.settings, mode);
    };

    updateThemeColors();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          updateThemeColors();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      clearTenantThemeCssVariables(document.documentElement);
    };
  }, [tenant]);

  return null;
}
