import fs from 'fs-extra';
import path from 'path';
import type { SocialProvider } from './types.js';

export async function updateAuthConfig(projectPath: string, socialProviders: SocialProvider[] = []) {
  const authIndexPath = path.join(projectPath, 'packages/auth/src/index.ts');
  let content = await fs.readFile(authIndexPath, 'utf-8');

  // Add imports for selected social providers
  let imports = `import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import { emailOTP, oAuthProxy, openAPI, phoneNumber } from "better-auth/plugins";
import { config } from "@repo/config";`;

  // Add Apple trusted origins if needed
  if (socialProviders.includes('apple')) {
    content = content.replace(
      'export const auth = betterAuth({',
      `export const auth = betterAuth({
  // Add appleid.apple.com to trustedOrigins for Sign In with Apple flows
  trustedOrigins: ["https://appleid.apple.com"],`
    );
  }

  // Update the file
  await fs.writeFile(authIndexPath, content, 'utf-8');
}
