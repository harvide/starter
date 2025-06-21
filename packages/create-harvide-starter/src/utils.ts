import { execa } from 'execa';
import { execSync } from 'child_process';
import type { PackageManager } from './types.js';

export async function isPackageManagerInstalled(packageManager: PackageManager): Promise<boolean> {
  if (packageManager === 'npm') return true; // npm is always available
  try {
    const result = await execa(packageManager, ['--version']);
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

export async function ensurePackageManager(packageManager: PackageManager): Promise<void> {
  if (packageManager === 'npm') return; // npm is always available

  const isInstalled = await isPackageManagerInstalled(packageManager);
  if (!isInstalled) {
    console.log(`${packageManager} not found, installing globally...`);
    try {
      await execa('npm', ['install', '-g', packageManager]);
      
      // Verify installation
      const installed = await isPackageManagerInstalled(packageManager);
      if (!installed) {
        throw new Error(`Failed to verify ${packageManager} installation`);
      }
    } catch (error) {
      console.error(`Failed to install ${packageManager}. Please install it manually.`);
      if (error instanceof Error) {
        throw new Error(`Package manager installation failed: ${error.message}`);
      }
      throw error;
    }
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
