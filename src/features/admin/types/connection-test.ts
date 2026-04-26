export type ConnectionTestCode =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'UNSUPPORTED_PROVIDER'
  | 'BUCKET_NOT_FOUND'
  | 'UNKNOWN';

export type ConnectionTestResult = {
  ok: boolean;
  message: string;
  code?: ConnectionTestCode;
  durationMs?: number;
};

export type AIConnectionTestInput = {
  provider: 'openai' | 'anthropic';
  apiKey: string;
};

export type StorageConnectionTestInput = {
  provider: 's3' | 'minio' | 'r2';
  endpoint?: string;
  publicEndpoint?: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region?: string;
  forcePathStyle?: boolean;
};
