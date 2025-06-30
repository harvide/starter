import { config } from '@repo/config';
import { getSignupFormVariant } from '@repo/ui/components/auth/signup-form';
import { Button } from '@repo/ui/components/button';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ToastOnPageLoadWrapper } from '@/components/wrapper/toast-client-wrapper';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignupPage() {
  const BasicSignupForm = getSignupFormVariant(config.ui.signupForm);
  if (!BasicSignupForm) {
    throw new Error(`Signup form variant "${config.ui.signupForm}" not found.`);
  }

  if (config.auth.emailAndPassword.disableSignUp) {
    return (
      <>
        <ToastOnPageLoadWrapper
          data={{ description: <>Please contact support for assistance.</> }}
          message={<>Signup is currently disabled.</>}
          type="error"
        />
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <h1 className="text-center font-bold text-2xl">Signup Disabled</h1>
            <p className="mt-4 text-center">
              Signup is currently disabled. Please contact support for
              assistance.
            </p>
          </div>
          <div className="mt-6 flex flex-row items-center self-center">
            <Link href="/auth/signin">
              <Button className="w-full" variant="default">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <BasicSignupForm />
      </div>
    </div>
  );
}
