import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import { openAPI } from "better-auth/plugins";
import { config } from "@repo/config";

let plugins: BetterAuthPlugin[] = [
  // captcha({
  //   provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha
  //   secretKey: process.env.TURNSTILE_SECRET_KEY!,
  // }),
]
if (config.env === "development") {
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
    enabled: true,

    autoSignIn: false,

    disableSignUp: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      throw new Error("Reset password is not implemented yet");
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   text: `Click the link to reset your password: ${url}`,
      // });
    },
    resetPasswordTokenExpiresIn: 3600
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