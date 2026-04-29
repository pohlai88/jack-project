export interface LinkedInTokenResponse {
  access_token: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export interface LinkedInUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string | { country?: string; language?: string };
  profile?: string;
}
