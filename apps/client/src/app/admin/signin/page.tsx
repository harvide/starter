import { config } from '@repo/config';
import { getAdminSignupFormVariant } from '@repo/ui/components/auth/admin-signup-form';
import { checkAdminsExist } from '@repo/ui/components/auth/admin-signup-form/flows';
import { getLoginFormVariant } from '@repo/ui/components/auth/login-form';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: `Admin Sign in - ${config.branding.name}`,
  description: config.branding.description,
};

async function AdminSignInPage() {
  if (!config.admin.enabled) {
    return notFound();
  }

  const adminsExist = await checkAdminsExist();
  if (adminsExist.error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{adminsExist.error}</p>
      </div>
    );
  }

  if (!adminsExist.exists) {
    const BasicSignupForm = getAdminSignupFormVariant('basic');
    if (!BasicSignupForm) {
      throw new Error(`Signup form variant "basic" not found.`);
    }

    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <BasicSignupForm />
        </div>
      </div>
    );
  }

  const LoginForm = getLoginFormVariant(config.ui.loginForm);
  if (!LoginForm) {
    throw new Error(`Login form variant "${config.ui.loginForm}" not found.`);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          callbackUrl="/admin/dashboard"
          forceEmailAndPasswordOnly
          header={<>Admin Sign In</>}
          subtitle={<>Please sign in to access the admin dashboard.</>}
        />
      </div>
    </div>
  );
}

export default AdminSignInPage;
