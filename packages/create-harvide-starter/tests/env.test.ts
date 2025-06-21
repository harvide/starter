import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEnvContent } from '../src/env';
import type { SocialProvider } from '../src/types';

describe('Environment Content Generation', () => {

  it('should generate base env variables when no providers selected', () => {
    const content = generateEnvContent([]);
    expect(content).toContain('DATABASE_URL=');
    expect(content).toContain('AUTH_SECRET=');
  });

  it('should generate google provider env variables', () => {
    const content = generateEnvContent(['google']);
    expect(content).toContain('GOOGLE_CLIENT_ID=""');
    expect(content).toContain('GOOGLE_CLIENT_SECRET=""');
  });

  it('should generate github provider env variables', () => {
    const content = generateEnvContent(['github']);
    expect(content).toContain('GITHUB_CLIENT_ID=""');
    expect(content).toContain('GITHUB_CLIENT_SECRET=""');
  });

  it('should generate apple provider env variables with additional fields', () => {
    const content = generateEnvContent(['apple']);
    expect(content).toContain('APPLE_CLIENT_ID=""');
    expect(content).toContain('APPLE_CLIENT_SECRET=""');
    expect(content).toContain('APPLE_APP_BUNDLE_IDENTIFIER=""');
  });

  it('should handle multiple providers', () => {
    const providers: SocialProvider[] = ['google', 'github', 'apple'];
    const content = generateEnvContent(providers);
    expect(content).toContain('GOOGLE_CLIENT_ID=""');
    expect(content).toContain('GITHUB_CLIENT_ID=""');
    expect(content).toContain('APPLE_CLIENT_ID=""');
  });

  it('should maintain spacing between sections', () => {
    const content = generateEnvContent(['google', 'github']);
    expect(content).toMatch(/\n\n# Google OAuth/);
    expect(content).toMatch(/\n\n# GitHub OAuth/);
  });

  it('should handle unknown providers gracefully', () => {
    const content = generateEnvContent(['google', 'unknown' as any]);
    expect(content).toContain('GOOGLE_CLIENT_ID=""');
    expect(content).not.toContain('undefined');
  });
});
