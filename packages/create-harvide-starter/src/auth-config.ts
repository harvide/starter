import path from 'node:path';
import fs from 'fs-extra';
import type { SocialProvider } from './types.js';

export async function updateAuthConfig(
  projectPath: string,
  socialProviders: SocialProvider[] = []
) {
  const authIndexPath = path.join(projectPath, 'packages/auth/src/index.ts');
  let content = await fs.readFile(authIndexPath, 'utf-8');

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
