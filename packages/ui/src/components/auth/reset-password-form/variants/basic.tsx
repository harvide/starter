'use client';

import { config } from '@repo/config';
import { Button } from '@repo/ui/components/button';
import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { showToast } from '@repo/ui/lib/toast';
import { cn } from '@repo/ui/lib/utils';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type * as flows from '../flows';
import { handleResetPassword } from '../flows';

export function BasicResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function buildFlowProps(): flows.ResetPasswordFlowProps {
    return {
      onError: (err) => {
        setError(
          `${err.code || 'Error'}: ${err.message || 'An error occurred.'}`
        );
        setIsLoading(false);
        showToast.error(err.message || 'An error occurred. Please try again.');
      },
      onSuccess: () => router.push('/auth/signin'),
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const data = new FormData(e.currentTarget);
    const newPassword = data.get('newPassword') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    const token = data.get('token') as string;
    if (!(newPassword && confirmPassword && token)) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      showToast.error('Passwords do not match. Please try again.');
      return;
    }

    await handleResetPassword(
      newPassword,
      confirmPassword,
      token,
      buildFlowProps()
    );
  }

  if (!searchParams?.get('token')) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-red-500 text-sm">
          Invalid or missing reset token. Please try again.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/auth/signin">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card className="w-[400px]">
        <CardContent>
          <form className="space-y-4 p-6" onSubmit={handleSubmit}>
            <input
              name="token"
              type="hidden"
              value={searchParams.get('token') || ''}
            />
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

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>

            <Button asChild className="w-full" type="button" variant="outline">
              <Link href="/auth/signin">Back to Login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
