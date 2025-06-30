import { authClient } from '@repo/auth/client';
import { showToast } from '@repo/ui/lib/toast';
import { redirect } from 'next/navigation';

export type ResetPasswordFlowProps = {
  onError: (error: {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  }) => void;
  onSuccess: () => void;
};

export async function handleResetPassword(
  newPassword: string,
  confirmPassword: string,
  token: string,
  props: ResetPasswordFlowProps
) {
  if (newPassword !== confirmPassword) {
    props.onError({
      code: 'password_mismatch',
      message: 'Passwords do not match.',
      status: 400,
      statusText: 'Bad Request',
    });
    return;
  }

  if (!token) {
    props.onError({
      code: 'missing_token',
      message: 'Reset token is required.',
      status: 400,
      statusText: 'Bad Request',
    });
    redirect('/auth/signin');
  }

  const { data, error } = await authClient.resetPassword({
    newPassword,
    token,
  });

  if (error) {
    props.onError({
      code: error.code,
      message: error.message,
      status: error.status,
      statusText: error.statusText,
    });
    return;
  }

  if (data) {
    showToast.success('Password reset successfully! You can now sign in.');
    props.onSuccess();
  }
}
