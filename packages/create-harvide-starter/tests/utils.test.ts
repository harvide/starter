import { execa } from 'execa';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ensurePackageManager, installDependencies } from '../src/utils';

vi.mock('execa', () => ({
  execa: vi.fn(),
}));

describe('Package Manager Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ensurePackageManager', () => {
    it('should not install npm if already exists', async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '10.0.0' } as any);
      await ensurePackageManager('npm');
      expect(execa).toHaveBeenCalledWith('npm', ['--version']);
      expect(execa).not.toHaveBeenCalledWith('npm', ['install', '-g', 'npm']);
    });

    it('should not install yarn if already exists', async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '1.22.19' } as any);
      await ensurePackageManager('yarn');
      expect(execa).toHaveBeenCalledWith('yarn', ['--version']);
      expect(execa).not.toHaveBeenCalledWith('npm', ['install', '-g', 'yarn']);
    });

    it('should not install pnpm if already exists', async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '8.6.12' } as any);
      await ensurePackageManager('pnpm');
      expect(execa).toHaveBeenCalledWith('pnpm', ['--version']);
      expect(execa).not.toHaveBeenCalledWith('npm', ['install', '-g', 'pnpm']);
    });

    it('should not install bun if already exists', async () => {
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '1.0.0' } as any);
      await ensurePackageManager('bun');
      expect(execa).toHaveBeenCalledWith('bun', ['--version']);
      expect(execa).not.toHaveBeenCalledWith('npm', ['install', '-g', 'bun']);
    });

    it('should install pnpm if not found', async () => {
      vi.mocked(execa).mockRejectedValueOnce(new Error('not found'));
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '' } as any);
      await ensurePackageManager('pnpm');
      expect(execa).toHaveBeenCalledWith('pnpm', ['--version']);
      expect(execa).toHaveBeenCalledWith('npm', ['install', '-g', 'pnpm']);
    });

    it('should install yarn if not found', async () => {
      vi.mocked(execa).mockRejectedValueOnce(new Error('not found'));
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '' } as any);
      await ensurePackageManager('yarn');
      expect(execa).toHaveBeenCalledWith('yarn', ['--version']);
      expect(execa).toHaveBeenCalledWith('npm', ['install', '-g', 'yarn']);
    });

    it('should install bun if not found', async () => {
      vi.mocked(execa).mockRejectedValueOnce(new Error('not found'));
      vi.mocked(execa).mockResolvedValueOnce({ stdout: '' } as any);
      await ensurePackageManager('bun');
      expect(execa).toHaveBeenCalledWith('bun', ['--version']);
      expect(execa).toHaveBeenCalledWith('npm', ['install', '-g', 'bun']);
    });
  });

  describe('installDependencies', () => {
    it('should run npm install', async () => {
      await installDependencies('npm', '/test/path');
      expect(execa).toHaveBeenCalledWith('npm', ['install'], {
        cwd: '/test/path',
        stdio: 'inherit',
      });
    });

    it('should run yarn install', async () => {
      await installDependencies('yarn', '/test/path');
      expect(execa).toHaveBeenCalledWith('yarn', ['install'], {
        cwd: '/test/path',
        stdio: 'inherit',
      });
    });

    it('should run pnpm install', async () => {
      await installDependencies('pnpm', '/test/path');
      expect(execa).toHaveBeenCalledWith('pnpm', ['install'], {
        cwd: '/test/path',
        stdio: 'inherit',
      });
    });

    it('should run bun install', async () => {
      await installDependencies('bun', '/test/path');
      expect(execa).toHaveBeenCalledWith('bun', ['install'], {
        cwd: '/test/path',
        stdio: 'inherit',
      });
    });
  });
});
