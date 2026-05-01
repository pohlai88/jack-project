type Auth0ProviderInput = {
  AUTH0_CLIENT_ID?: string;
  AUTH0_CLIENT_SECRET?: string;
  AUTH0_ISSUER?: string;
  AUTH0_DOMAIN?: string;
};

export function resolveAuth0IssuerUrl(input: Pick<Auth0ProviderInput, 'AUTH0_ISSUER' | 'AUTH0_DOMAIN'>) {
  if (input.AUTH0_ISSUER) {
    return input.AUTH0_ISSUER.replace(/\/+$/, '');
  }

  const domain = input.AUTH0_DOMAIN?.trim();
  if (!domain) {
    return undefined;
  }

  const normalizedDomain = domain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  return normalizedDomain ? `https://${normalizedDomain}` : undefined;
}

export function isAuth0ProviderConfigured(input: Auth0ProviderInput) {
  return Boolean(input.AUTH0_CLIENT_ID && input.AUTH0_CLIENT_SECRET && resolveAuth0IssuerUrl(input));
}
