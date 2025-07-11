'use client';
import { config } from '@repo/config';
import { getResetPasswordFormVariant } from '@repo/ui/components/auth/reset-password-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  const ResetPasswordForm = getResetPasswordFormVariant(
    config.ui.resetPasswordForm
  );
  if (!ResetPasswordForm) {
    throw new Error(
      `Reset password form variant "${config.ui.resetPasswordForm}" not found.`
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
}
