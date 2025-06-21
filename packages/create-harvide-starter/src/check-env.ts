import { SocialProvider } from './types.js';

function getRequiredEnvVars(provider: SocialProvider): string[] {
  switch (provider) {
    case 'facebook':
      return ['FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET'];
    case 'apple':
      return ['APPLE_CLIENT_ID', 'APPLE_CLIENT_SECRET', 'APPLE_APP_BUNDLE_IDENTIFIER'];
    case 'discord':
      return ['DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET'];
    case 'github':
      return ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
    case 'google':
      return ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
    case 'twitter':
      return ['TWITTER_CLIENT_ID', 'TWITTER_CLIENT_SECRET'];
    case 'linkedin':
      return ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'];
    default:
      return [];
  }
}

export function checkMissingEnvVars(providers: SocialProvider[]): string[] {
  const missingVars: string[] = [];

  for (const provider of providers) {
    const requiredVars = getRequiredEnvVars(provider);
    for (const envVar of requiredVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }
  }

  return missingVars;
}
