import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSpinner } from '../src/spinner';

vi.mock('@clack/prompts', () => ({
  spinner: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));

describe('Spinner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a spinner with given message', () => {
    const message = 'Loading...';
    const spinner = createSpinner(message);
    expect(spinner).toHaveProperty('success');
    expect(spinner).toHaveProperty('error');
    expect(spinner).toHaveProperty('stop');
  });

  it('should handle success message', () => {
    const spinner = createSpinner('Loading...');
    const successMessage = 'Operation completed successfully';
    spinner.success(successMessage);
  });

  it('should handle error message', () => {
    const spinner = createSpinner('Loading...');
    const errorMessage = 'Operation failed';
    spinner.error(errorMessage);
  });

  it('should handle stop', () => {
    const spinner = createSpinner('Loading...');
    spinner.stop();
  });
});
