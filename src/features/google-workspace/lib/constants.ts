export const GOOGLE_OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

export const GOOGLE_WORKSPACE_PROVIDER_ID = 'google-workspace';
export const GOOGLE_WORKSPACE_CALLBACK_PATH = '/api/integrations/google-workspace/callback';

export const GOOGLE_WORKSPACE_REQUIRED_SCOPES = ['openid', 'email', 'profile'] as const;
