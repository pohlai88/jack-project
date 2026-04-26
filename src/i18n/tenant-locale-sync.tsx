'use client';

import { useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';

import { type Locale } from './config';
import { buildLocalePreferenceCookies, resolveLocaleCookie, shouldApplyTenantDefaultLocale } from './locale-cookie';

export function TenantLocaleSync({ tenantDefaultLocale }: { tenantDefaultLocale?: Locale | null }) {
  const currentLocale = useLocale();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) {
      return;
    }

    if (!tenantDefaultLocale) {
      return;
    }

    if (
      shouldApplyTenantDefaultLocale({
        currentLocale,
        cookieString: document.cookie,
        tenantDefaultLocale,
      })
    ) {
      appliedRef.current = true;
      for (const cookie of buildLocalePreferenceCookies(tenantDefaultLocale, 'tenant-default')) {
        document.cookie = cookie;
      }
      if (resolveLocaleCookie(document.cookie) === tenantDefaultLocale) {
        window.location.reload();
      }
    }
  }, [currentLocale, tenantDefaultLocale]);

  return null;
}
