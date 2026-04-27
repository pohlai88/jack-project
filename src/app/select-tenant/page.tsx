import { redirect } from 'next/navigation';

import { defaultLocale } from '@/i18n/config';

/** Legacy unprefixed `/select-tenant` → locale-aware tenant selection. */
export default function LegacySelectTenantRedirect() {
  redirect(`/${defaultLocale}/select-tenant`);
}
