export type StarterType = 'basic' | 'pro';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type Feature = 'web' | 'docs' | 'admin';
export type AuthMethod = 'email' | 'phone' | 'social';

export type SocialProvider =
  | 'facebook'
  | 'apple'
  | 'discord'
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin';

export type LLMType =
  | 'claude'
  | 'cursor'
  | 'windsurf'
  | 'copilot'
  | 'zed'
  | 'codex'
  | 'none';

export type PaymentProvider = 'polar' | 'stripe';

export type MailProvider = 'resend' | 'smtp'; // New type for mail providers

export interface CliAnswers {
  isStarter: StarterType;
  projectPath: string;
  name: string;
  description?: string;
  packageManager: PackageManager;
  features: Feature[];
  auth: AuthMethod[] | null;
  socialProviders?: SocialProvider[];
  llm?: LLMType;
  mailProvider?: MailProvider; // Add mailProvider to CLI answers
  paymentProvider?: PaymentProvider;
  useWebhook?: boolean;
}

export interface CreateAppOptions {
  projectPath: string;
  appName: string;
  description: string;
  packageManager: PackageManager;
  features: Feature[];
  auth?: AuthMethod[];
  socialProviders?: SocialProvider[];
  llm?: LLMType;
  mailProvider?: MailProvider; // Add mailProvider to app options
  paymentProvider?: PaymentProvider;
  useWebhook?: boolean;
}

export interface SocialProviderConfig {
  clientId: string;
  clientSecret: string;
  [key: string]: string;
}

export interface AuthConfig {
  [provider: string]: {
    enabled: boolean;
    clientId?: string;
    clientSecret?: string;
    [key: string]: any;
  };
}
