"use client";

import { getLoginFormVariant } from "@/components/auth";
import { config } from "@repo/config";

export default function SignInPage() {
  const LoginForm = getLoginFormVariant(config.ui.loginForm);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>);
}
