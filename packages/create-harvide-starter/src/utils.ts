import { execa } from 'execa';
import type { PackageManager } from './types.js';

export async function ensurePackageManager(packageManager: PackageManager): Promise<void> {
  try {
    await execa(packageManager, ['--version']);
  } catch {
    console.log(`Installing ${packageManager} globally...`);
    await execa('npm', ['install', '-g', packageManager]);
  }
}

export async function installDependencies(packageManager: PackageManager, cwd: string): Promise<void> {
  const commands = {
    npm: ['install'],
    pnpm: ['install'],
    yarn: ['install'],
    bun: ['install']
  };

  await execa(packageManager, commands[packageManager], {
    cwd,
    stdio: 'inherit' // Show installation progress
  });
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const SocialProviderConfigs = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID as string,
    clientSecret: process.env.APPLE_CLIENT_SECRET as string,
    appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID as string,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
  },
} as const;

export const socialProviderNames = {
  facebook: 'Facebook',
  apple: 'Apple',
  discord: 'Discord',
  github: 'GitHub',
  google: 'Google',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
} as const;

export type SocialProvider = keyof typeof SocialProviderConfigs;
