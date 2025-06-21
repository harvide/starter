import type { CreateAppOptions } from './types.js';
import { deepClone, SocialProviderConfigs, stringifyConfig } from './utils.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { generateEnvContent } from './env.js';
import { checkMissingEnvVars } from './check-env.js';
import defaultConfig from '../../../starter.config.js';

export async function generateConfig(options: CreateAppOptions) {
  const { appName, description, auth = [], socialProviders = [], projectPath } = options;

  // Clone the starter config
  const config = deepClone(defaultConfig) as typeof defaultConfig.default;

  // Update branding
  config.branding.name = appName;
  config.branding.description = description;
  config.branding.logo.altText = `${appName} Logo`;

  // Update auth settings
  config.auth.phone.enabled = auth.includes('phone');
  config.auth.emailAndPassword.enabled = auth.includes('email');

  // Handle social providers
  const socialProviderConfig: Record<string, { enabled: boolean; clientId?: string; clientSecret?: string; [key: string]: any }> = {};
  
  if (auth.includes('social') && socialProviders.length > 0) {
    for (const provider of socialProviders) {
      socialProviderConfig[provider] = { 
        enabled: true,
        ...SocialProviderConfigs[provider]
      };
    }
  }
  
  config.auth.socialProviders = socialProviderConfig;

  // Check for missing environment variables
  const missingVars = checkMissingEnvVars(socialProviders);
  if (missingVars.length > 0) {
    console.log(chalk.yellow('\nWarning: Missing environment variables for social providers:'));
    missingVars.forEach(envVar => {
      console.log(chalk.yellow(`  - ${envVar}`));
    });
    console.log(chalk.yellow('\nPlease set these variables in your .env file.\n'));
  }

  // Generate and write .env file
  const envContent = generateEnvContent(auth.includes('social') ? socialProviders : []);
  await fs.writeFile(path.join(projectPath, '.env'), envContent);
  // Custom object stringifier that produces clean JS object literals

  return `/** 
 * @type {import('@repo/config').Config}
 */
export default ${stringifyConfig(config)} satisfies import('@repo/config').BaseConfig;`;
}
