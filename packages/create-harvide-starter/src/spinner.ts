import { spinner } from '@clack/prompts';

export function createSpinner(message: string) {
  const spin = spinner();
  spin.start(message);

  return {
    success: (text: string) => spin.stop(text),
    error: (text: string) => spin.stop(text, 1),
    stop: () => spin.stop(),
  };
}
