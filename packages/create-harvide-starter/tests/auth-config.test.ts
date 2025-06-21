import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateAuthConfig } from '../src/auth-config';
import type { SocialProvider } from '../src/types';
import fs from 'fs-extra';
import path from 'path';

vi.mock('fs-extra');
vi.mock('path');

describe('Auth Configuration', () => {
  const mockProjectPath = '/test/project';
  const mockAuthPath = '/test/project/packages/auth/src/index.ts';
  const baseAuthContent = 'export const auth = betterAuth({';

  beforeEach(() => {
    vi.mocked(path.join as any).mockReturnValue(mockAuthPath);
    vi.mocked(fs.readFile as any).mockResolvedValue(baseAuthContent);
    vi.mocked(fs.writeFile as any).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not add trusted origins when no providers selected', async () => {
    await updateAuthConfig(mockProjectPath, []);
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockAuthPath,
      baseAuthContent,
      'utf-8'
    );
  });

  it('should add apple trusted origins when apple provider is selected', async () => {
    await updateAuthConfig(mockProjectPath, ['apple']);
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockAuthPath,
      expect.stringContaining('trustedOrigins: ["https://appleid.apple.com"]'),
      'utf-8'
    );
  });

  it('should not add trusted origins for non-apple providers', async () => {
    await updateAuthConfig(mockProjectPath, ['google', 'github']);
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockAuthPath,
      baseAuthContent,
      'utf-8'
    );
  });

  it('should correctly handle paths using path.join', async () => {
    await updateAuthConfig(mockProjectPath, ['apple']);
    expect(path.join).toHaveBeenCalledWith(mockProjectPath, 'packages/auth/src/index.ts');
  });

  it('should read the original file content', async () => {
    await updateAuthConfig(mockProjectPath, ['apple']);
    expect(fs.readFile).toHaveBeenCalledWith(mockAuthPath, 'utf-8');
  });
});
