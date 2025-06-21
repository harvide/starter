import { config } from "@repo/config";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLoginFormVariant } from "@/components/auth";
import { BasicSignupForm } from "@/components/auth/admin-signup-form/basic";
import { checkAdminsExist } from "@/components/auth/flows/admin-signup";

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
    console.error("Error checking admin accounts:", adminsExist.error);
    return (
      <div>
        <h1>Error</h1>
        <p>{adminsExist.error}</p>
      </div>
    );
  }

  if (!adminsExist.exists) {
    console.warn(
      "No admin account found. Please create an admin account at /admin/signup"
    );
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
        <LoginForm />
      </div>
    </div>
  );
}

export default AdminSignInPage;
