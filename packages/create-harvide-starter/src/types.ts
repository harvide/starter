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

export type LLMType = 'claude' | 'cursor' | 'windsurf' | 'copilot' | 'zed' | 'codex' | 'none';

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
