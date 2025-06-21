"use server";
import { authClient } from "@/lib/auth";
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

export async function handleAdminSignup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  props: SignupFlowProps
) {
  try {
    const newUser = await authClient.admin.createUser({
      email,
      password,
      name: `${firstName} ${lastName}`,
      role: ["admin"],
    });

    if (newUser.error) {
      props.onError(newUser.error.message ?? null);
      return;
    }

    props.onSuccess();
  } catch (error: any) {
    props.onError(error?.message || "Something went wrong");
  }
}
