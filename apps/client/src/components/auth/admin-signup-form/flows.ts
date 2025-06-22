"use server";
import { auth } from "@repo/auth/index";
import { config } from "@repo/config";

export interface SignupFlowProps {
  onError: (error: string | null) => void;
  onSuccess: () => void;
}

export async function checkAdminsExist() {
  if (!config.admin.enabled) {
    return { error: "Admin feature is disabled" };
  }

  try {
    const ctx = await auth.$context;
    // make OR connector working todo
    const adminUsers = await ctx.internalAdapter.listUsers(
      undefined,
      undefined,
      undefined,
      [
        {
          field: "role",
          operator: "contains",
          value: "admin",
        }
      ]
    );
    const superAdminUsers = await ctx.internalAdapter.listUsers(
      undefined,
      undefined,
      undefined,
      [
        {
          field: "role",
          operator: "contains",
          value: "superadmin"
        }
      ]
    );

    if (adminUsers.length > 0 || superAdminUsers.length > 0) {
      return { exists: true };
    }

    return { exists: false };
  } catch (error: any) {
    console.error("Error checking admin accounts:", error);
    return { error: error.message || "Failed to check admin accounts" };
  }
}

export async function createAdminUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> {
  if (!config.admin.enabled) return { success: false, error: "Admin feature is disabled" };

  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const { exists, error } = await checkAdminsExist();
    if (error) return { success: false, error };
    if (exists) return { success: false, error: "An admin account already exists" };

    const ctx = await auth.$context;

    const newUser = await ctx.internalAdapter.createUser({
      email,
      name: `${firstName} ${lastName}`,
      role: "superadmin",
      emailVerified: true,
      image: config.branding.logo.icon,
    });

    const hash = await ctx.password.hash(password);
    await ctx.internalAdapter.linkAccount({
      userId: newUser.id,
      providerId: "credential",
      accountId: newUser.id,
      password: hash
    })

    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      return { success: false, error: "A user with this email already exists" };
    }

    return { success: false, error: err?.message || "Unknown error" };
  }
}