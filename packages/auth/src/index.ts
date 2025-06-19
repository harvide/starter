import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import { openAPI } from "better-auth/plugins";
import { config } from "@repo/config";

let plugins: BetterAuthPlugin[] = config.plugins;
if (config.env === "development" && !plugins.some(plugin => plugin.id === 'open-api')) {
  // Add OpenAPI plugin only in development mode if not already included
  plugins = [
    ...plugins,
    openAPI(),
  ]
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  appName: config.branding.name,
  baseURL: config.urls.client,

  plugins: plugins,

  emailAndPassword: {
    ...config.auth.emailAndPassword,
    sendResetPassword: async ({ user, url, token }, request) => {
      throw new Error("Reset password is not implemented yet");
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   text: `Click the link to reset your password: ${url}`,
      // });
    }
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      throw new Error("Email verification is not implemented yet");
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
    },
  },

  socialProviders: config.auth.socialProviders
});