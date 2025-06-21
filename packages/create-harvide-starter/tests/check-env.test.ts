import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkMissingEnvVars } from '../src/check-env';
import { SocialProvider } from '../src/types';

describe('Check Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should pass when all required variables are present', () => {
    const providers: SocialProvider[] = ['google'];
    process.env.GOOGLE_CLIENT_ID = 'test-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-secret';

    const result = checkMissingEnvVars(providers);
    expect(result).toEqual([]);
  });

  it('should return missing variables for google provider', () => {
    const providers: SocialProvider[] = ['google'];
    const result = checkMissingEnvVars(providers);
    expect(result).toContain('GOOGLE_CLIENT_ID');
    expect(result).toContain('GOOGLE_CLIENT_SECRET');
  });

  it('should check multiple providers', () => {
    const providers: SocialProvider[] = ['google', 'github'];
    process.env.GOOGLE_CLIENT_ID = 'test-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-secret';

    const result = checkMissingEnvVars(providers);
    expect(result).toContain('GITHUB_CLIENT_ID');
    expect(result).toContain('GITHUB_CLIENT_SECRET');
    expect(result).not.toContain('GOOGLE_CLIENT_ID');
    expect(result).not.toContain('GOOGLE_CLIENT_SECRET');
  });

  it('should handle apple specific requirements', () => {
    const providers: SocialProvider[] = ['apple'];
    process.env.APPLE_CLIENT_ID = 'test-id';
    process.env.APPLE_CLIENT_SECRET = 'test-secret';

    const result = checkMissingEnvVars(providers);
    expect(result).toContain('APPLE_APP_BUNDLE_IDENTIFIER');
  });

  it('should return empty array when no providers', () => {
    const result = checkMissingEnvVars([]);
    expect(result).toEqual([]);
  });
});
