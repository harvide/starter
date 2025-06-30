'use client';

import { authClient } from '@repo/auth/client';
import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { showToast } from '@repo/ui/lib/toast';
import { cn } from '@repo/ui/lib/utils';
import type { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const newPassword = form.get('newPassword') as string;
    const confirmPassword = form.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('Invalid or missing reset token');
      router.push('/auth/signin');
      return;
    }

    const { data, error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(`${error.code}: ${error.message}`);
      return;
    }

    showToast.success('Password reset successful!');
    router.push('/auth/signin');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className={cn('flex flex-col gap-6')}>
        <Card className="w-[400px]">
          <CardContent>
            <form className="space-y-4 p-6" onSubmit={handleResetPassword}>
              <div className="mb-6 flex flex-col items-center text-center">
                <h1 className="font-bold text-2xl">Reset Password</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  Enter your new password below
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  placeholder={config.preferences.placeholders.password}
                  required
                  type="password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder={config.preferences.placeholders.password}
                  required
                  type="password"
                />
              </div>

              {error && (
                <p className="text-center text-red-500 text-sm">{error}</p>
              )}

              <Button className="w-full" type="submit">
                Reset Password
              </Button>

              <Button
                className="w-full"
                onClick={() => router.push('/auth/signin')}
                type="button"
                variant="outline"
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
