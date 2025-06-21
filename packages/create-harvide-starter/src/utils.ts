import { execa } from 'execa';
import type { PackageManager } from './types.js';

export async function isPackageManagerInstalled(packageManager: PackageManager): Promise<boolean> {
  try {
    await execa(packageManager, ['--version']);
    return true;
  } catch {
    if (packageManager === 'npm') {
      throw new Error('npm is required but not found');
    }
    return false;
  }
}

export async function ensurePackageManager(packageManager: PackageManager): Promise<void> {
  try {
    await execa(packageManager, ['--version']);
    return;
  } catch (error) {
    if (packageManager === 'npm') {
      throw new Error('npm is required but not found');
    }

    console.log(`${packageManager} not found, installing globally...`);
    try {
      await execa('npm', ['install', '-g', packageManager]);
      
      // Verify installation
      try {
        await execa(packageManager, ['--version']);
      } catch {
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

/**
 * Converts an object into a string representation with clean JavaScript object literal syntax
 * (without unnecessary quotes around property names)
 */
export function stringifyConfig(obj: any, indent = 0): string {
  if (obj === null) return 'null';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => `${' '.repeat(indent + 2)}${stringifyConfig(item, indent + 2)}`);
    return `[\n${items.join(',\n')}\n${' '.repeat(indent)}]`;
  }
  
  const entries = Object.entries(obj);
  if (entries.length === 0) return '{}';
  
  const props = entries.map(([key, value]) => {
    // Use string literal only if key contains special characters
    const needsQuotes = !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
    const keyStr = needsQuotes ? JSON.stringify(key) : key;
    return `${' '.repeat(indent + 2)}${keyStr}: ${stringifyConfig(value, indent + 2)}`;
  });
  
  return `{\n${props.join(',\n')}\n${' '.repeat(indent)}}`;
}

export function generateSecretKey(length = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return secret;
}

export async function getPackageManagerVersion(pm: string): Promise<string> {
  const { stdout } = await execa(pm, ['--version']);
  return stdout.trim();
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
