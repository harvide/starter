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
    const adminUsers = await (await auth.$context).internalAdapter.listUsers(
      undefined,
      undefined,
      undefined,
      [
        {
          field: "role",
          value: "admin"
        }
      ]
    );

    if (adminUsers.length > 0) {
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

    await (await auth.$context).internalAdapter.createUser({
      email,
      password,
      name: `${firstName} ${lastName}`,
      role: "admin", // ✅ FIXED: single role
      emailVerified: true,
      image: config.branding.logo.icon,
    });

    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      return { success: false, error: "A user with this email already exists" };
    }

    return { success: false, error: err?.message || "Unknown error" };
  }
}