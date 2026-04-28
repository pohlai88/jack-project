/**
 * Normalize and validate custom apex hostnames for tenant routing (verified DNS).
 */

const HOSTNAME_RE =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$|^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9]))$/;

/** Strip port; lowercase labels; no trailing dot. */
export function normalizeCustomDomainHostname(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const host = raw.split(':')[0]!.trim().toLowerCase().replace(/\.$/, '');
  if (!host || host.length > 253) return null;
  if (!HOSTNAME_RE.test(host)) return null;
  if (host === 'localhost' || host.endsWith('.localhost')) return host;
  if (host === 'vercel.app' || host.endsWith('.vercel.app')) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
  return host;
}

export function assertCustomDomainHostnameAllowed(
  hostname: string,
  tenantRootDomain: string | null | undefined,
): string | null {
  const root = tenantRootDomain
    ?.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    ?.split(':')[0];
  if (root && (hostname === root || hostname === `www.${root}`)) {
    return 'Choose a hostname that is not the app apex (use tenant subdomains or a dedicated hostname).';
  }
  return null;
}
