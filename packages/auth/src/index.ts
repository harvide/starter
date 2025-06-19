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
    openAPI()
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
      if (!config.auth.emailAndPassword.sendResetPassword) {
        throw new Error("Sending reset password emails is disabled in the configuration");
      }
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   text: `Click the link to reset your password: ${url}`,
      // });
    }
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (!config.auth.emailAndPassword.sendVerificationEmail) {
        throw new Error("Sending verification emails is disabled in the configuration");
      }
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
    },
  },

  socialProviders: config.auth.socialProviders
});