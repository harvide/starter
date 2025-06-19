import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
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
});