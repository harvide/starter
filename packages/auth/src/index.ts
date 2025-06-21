import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import { emailOTP, oAuthProxy, openAPI, phoneNumber } from "better-auth/plugins";
import { config } from "@repo/config";

let plugins: BetterAuthPlugin[] = [
  emailOTP({
    ...config.auth.emailAndPassword.otp,

    // uncomment to use a custom OTP generation function
    // Note: This is just an example, you can implement your own OTP generation logic
    // generateOTP: () => {
    //   return Math.floor(100000 + Math.random() * 900000).toString();
    // },

    async sendVerificationOTP({
      email,
      otp,
      type
    }) {
      if (type === "sign-in") {
        // Send the OTP for sign-in
      } else if (type === "email-verification") {
        // Send the OTP for email verification
      } else {
        // Send the OTP for password reset
      }
    },
  }),
  phoneNumber({
    ...config.auth.phone.otp,
    sendOTP: ({ phoneNumber, code }, request) => {
      // Implement sending OTP code via SMS
    },
    sendPasswordResetOTP: ({ phoneNumber, code }, request) => {
      
    },
    signUpOnVerification: {
      getTempEmail: (phoneNumber) => {
        return `${phoneNumber}@example.com`
      },
      //optionally, you can also pass `getTempName` function to generate a temporary name for the user
      getTempName: (phoneNumber) => {
        return phoneNumber //by default, it will use the phone number as the name
      }
    }
  })
];
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
      if (!config.auth.emailAndPassword.requireEmailVerification) {
        throw new Error("Sending verification emails is disabled in the configuration");
      }
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
    },
  },

  account: config.auth.account,

  socialProviders: config.auth.socialProviders
});