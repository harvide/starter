import path from 'node:path';
import fs from 'fs-extra';
import defaultConfig from '../../../starter.config.js';
import { checkMissingEnvVars } from './check-env.js';
import { generateEnvContent } from './env.js';
import type { CreateAppOptions } from './types.js';
import { deepClone, SocialProviderConfigs, stringifyConfig } from './utils.js';

export async function generateConfig(options: CreateAppOptions) {
  const {
    appName,
    description,
    auth = [],
    features,
    socialProviders = [],
    projectPath,
    mailProvider,
    paymentProvider,
    useWebhook,
  } = options;

  // Clone the starter config
  const config = deepClone(defaultConfig) as typeof defaultConfig.default;

  // Update email provider if specified
  if (mailProvider) {
    config.email.enabled = true;
    config.email.provider = mailProvider;
  }

  // Update branding
  config.branding.name = appName;
  config.branding.description = description;
  config.branding.logo.altText = `${appName} Logo`;

  // Update auth settings
  config.auth.phone.enabled = auth.includes('phone');
  config.auth.emailAndPassword.enabled = auth.includes('email');

  // Handle social providers
  const socialProviderConfig: Record<
    string,
    {
      enabled: boolean;
      clientId?: string;
      clientSecret?: string;
      [key: string]: any;
    }
  > = {};

  if (auth.includes('social') && socialProviders.length > 0) {
    for (const provider of socialProviders) {
      socialProviderConfig[provider] = {
        enabled: true,
        ...SocialProviderConfigs[provider],
      };
    }
  }

  config.auth.socialProviders = socialProviderConfig;

  config.admin.enabled = features.includes('admin');

  // Check for missing environment variables
  const missingVars = checkMissingEnvVars(socialProviders);
  if (missingVars.length > 0) {
    missingVars.forEach((_envVar) => { });
  }

  // Generate and write .env file
  const envContent = generateEnvContent(
    auth.includes('social') ? socialProviders : [],
    mailProvider,
    paymentProvider,
    useWebhook
  );
  const envFilePath = path.join(projectPath, '.env');
  await fs.ensureDir(path.dirname(envFilePath)); // Ensure directory exists
  await fs.writeFile(envFilePath, envContent);
  // Custom object stringifier that produces clean JS object literals

  return `/** 
 * @type {import('@repo/config').Config}
 */
export default ${stringifyConfig(config)} satisfies import('@repo/config').BaseConfig;`;
}
