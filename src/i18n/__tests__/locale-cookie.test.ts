import {
  buildLocaleCookie,
  buildLocalePreferenceCookies,
  buildLocaleSourceCookie,
  hasExplicitLocaleCookie,
  hasValidLocaleCookie,
  readLocaleCookie,
  readLocaleSourceCookie,
  resolveLocaleCookie,
  resolveLocaleValue,
  shouldApplyTenantDefaultLocale,
} from '../locale-cookie';

describe('locale-cookie', () => {
  it('builds the runtime locale cookie', () => {
    expect(buildLocaleCookie('zh-CN')).toBe('NEXT_LOCALE=zh-CN; path=/; max-age=31536000; SameSite=Lax');
  });

  it('builds locale preference cookies with a source marker', () => {
    expect(buildLocaleSourceCookie('user')).toBe('NEXT_LOCALE_SOURCE=user; path=/; max-age=31536000; SameSite=Lax');
    expect(buildLocalePreferenceCookies('vi', 'tenant-default')).toEqual([
      'NEXT_LOCALE=vi; path=/; max-age=31536000; SameSite=Lax',
      'NEXT_LOCALE_SOURCE=tenant-default; path=/; max-age=31536000; SameSite=Lax',
    ]);
  });

  it('reads the runtime locale cookie from a cookie string', () => {
    expect(readLocaleCookie('theme=dark; NEXT_LOCALE=vi; session=abc')).toBe('vi');
  });

  it('reads the locale cookie source marker', () => {
    expect(readLocaleSourceCookie('NEXT_LOCALE=vi; NEXT_LOCALE_SOURCE=user')).toBe('user');
    expect(readLocaleSourceCookie('NEXT_LOCALE=vi; NEXT_LOCALE_SOURCE=tenant-default')).toBe('tenant-default');
    expect(readLocaleSourceCookie('NEXT_LOCALE=vi; NEXT_LOCALE_SOURCE=unknown')).toBeNull();
  });

  it('resolves raw locale values', () => {
    expect(resolveLocaleValue('ms-MY')).toBe('ms');
    expect(resolveLocaleValue('id-ID')).toBe('id');
  });

  it('resolves configured locale cookies including regional aliases', () => {
    expect(resolveLocaleCookie('NEXT_LOCALE=ms-MY')).toBe('ms');
    expect(resolveLocaleCookie('NEXT_LOCALE=zh-cn')).toBe('zh-CN');
  });

  it('rejects unsupported locale cookies', () => {
    expect(hasValidLocaleCookie('NEXT_LOCALE=id')).toBe(true);
    expect(hasValidLocaleCookie('NEXT_LOCALE=th')).toBe(true);
    expect(hasValidLocaleCookie('NEXT_LOCALE=pt')).toBe(false);
  });

  it('treats user and legacy valid locale cookies as explicit preferences', () => {
    expect(hasExplicitLocaleCookie('NEXT_LOCALE=es; NEXT_LOCALE_SOURCE=user')).toBe(true);
    expect(hasExplicitLocaleCookie('NEXT_LOCALE=es')).toBe(true);
    expect(hasExplicitLocaleCookie('NEXT_LOCALE=es; NEXT_LOCALE_SOURCE=tenant-default')).toBe(false);
  });

  it('applies tenant default locale when there is no valid explicit cookie', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'en',
        cookieString: '',
        tenantDefaultLocale: 'vi',
      }),
    ).toBe(true);
  });

  it('does not override a valid explicit locale cookie', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'en',
        cookieString: 'NEXT_LOCALE=es',
        tenantDefaultLocale: 'vi',
      }),
    ).toBe(false);
  });

  it('can replace a tenant-default cookie when entering a tenant with a different default', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'vi',
        cookieString: 'NEXT_LOCALE=vi; NEXT_LOCALE_SOURCE=tenant-default',
        tenantDefaultLocale: 'ms',
      }),
    ).toBe(true);
  });

  it('keeps a matching tenant-default cookie without another reload', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'ms',
        cookieString: 'NEXT_LOCALE=ms; NEXT_LOCALE_SOURCE=tenant-default',
        tenantDefaultLocale: 'ms',
      }),
    ).toBe(false);
  });

  it('applies tenant default locale over a stale unsupported cookie', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'en',
        cookieString: 'NEXT_LOCALE=pt',
        tenantDefaultLocale: 'ms',
      }),
    ).toBe(true);
  });

  it('does not reload when the active locale already matches the tenant default', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'vi',
        cookieString: '',
        tenantDefaultLocale: 'vi',
      }),
    ).toBe(false);
  });

  it('does not apply a tenant default when none is configured', () => {
    expect(
      shouldApplyTenantDefaultLocale({
        currentLocale: 'en',
        cookieString: '',
        tenantDefaultLocale: null,
      }),
    ).toBe(false);
  });
});
