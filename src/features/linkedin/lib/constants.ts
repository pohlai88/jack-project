export const LINKEDIN_OAUTH_AUTHORIZE_URL = 'https://www.linkedin.com/oauth/v2/authorization';
export const LINKEDIN_OAUTH_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
export const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';

export const LINKEDIN_PROVIDER_ID = 'linkedin';
export const LINKEDIN_CALLBACK_PATH = '/api/integrations/linkedin/callback';

export const LINKEDIN_REQUIRED_SCOPES = ['openid', 'profile', 'email'] as const;
