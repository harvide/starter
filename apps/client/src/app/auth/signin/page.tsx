import { getLoginFormVariant } from "@repo/ui/components/auth/login-form";
import { config } from "@repo/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign in`
};

export default function SignInPage() {
  const LoginForm = getLoginFormVariant(config.ui.loginForm);
  if (!LoginForm) {
    throw new Error(`Login form variant "${config.ui.loginForm}" not found.`);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>);
}
