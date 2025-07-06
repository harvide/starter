import { config } from '@repo/config';
import { db, schema, userModel } from '@repo/db';
import { mail } from '@repo/mail';
import { type BetterAuthPlugin, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, emailOTP, openAPI, phoneNumber } from 'better-auth/plugins';

let plugins: BetterAuthPlugin[] = [
  nextCookies(),
  admin({
    ...config.admin,
  }),
  emailOTP({
    ...config.auth.emailAndPassword.otp,

    // uncomment to use a custom OTP generation function
    // Note: This is just an example, you can implement your own OTP generation logic
    // generateOTP: () => {
    //   return Math.floor(100000 + Math.random() * 900000).toString();
    // },

    async sendVerificationOTP({ email, otp, type }) {
      if (type === 'sign-in') {
        // Send the OTP for sign-in
      } else if (type === 'email-verification') {
        // Send the OTP for email verification
      } else {
        // Send the OTP for password reset
      }
    },
  }),
  phoneNumber({
    ...config.auth.phone.otp,
    sendOTP: ({ phoneNumber, code }, _request) => {
      // Implement sending OTP code via SMS
    },
    sendPasswordResetOTP: ({ phoneNumber, code }, _request) => { },
    signUpOnVerification: {
      getTempEmail: (phoneNumber) => {
        return `${phoneNumber}@example.com`;
      },
      //optionally, you can also pass `getTempName` function to generate a temporary name for the user
      getTempName: (phoneNumber) => {
        return phoneNumber; //by default, it will use the phone number as the name
      },
    },
  }),
];

if (
  process.env.NODE_ENV === 'development' &&
  !plugins.some((plugin) => plugin.id === 'open-api')
) {
  // Add OpenAPI plugin only in development mode if not already included
  plugins = [...plugins, openAPI()];
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema.auth,
  }),

  appName: config.branding.name,
  plugins,

  user: userModel,

  emailAndPassword: {
    ...config.auth.emailAndPassword,
    sendResetPassword: async ({ user, url, token }, _request) => {
      if (!config.auth.emailAndPassword.sendResetPassword) {
        throw new Error(
          'Sending reset password emails is disabled in the configuration'
        );
      }
      await mail.sendTemplate({
        from: config.email.from.noReply,
        to: user.email,
        subject: config.email.templates.resetPassword.subject,
        template: 'reset-password',
        variant: config.email.templates.resetPassword.variant,
        context: {
          user,
          url,
          token,
        },
      });
    },
  },

  emailVerification: {
    sendOnSignUp: config.auth.emailAndPassword.sendEmailVerificationOnSignup,
    sendVerificationEmail: async ({ user, url, token }, _request) => {
      if (!config.auth.emailAndPassword.requireEmailVerification) {
        throw new Error(
          'Sending verification emails is disabled in the configuration'
        );
      }
      await mail.sendTemplate({
        from: config.email.from.noReply,
        to: user.email,
        subject: config.email.templates.verification.subject,
        template: 'email-verification',
        variant: config.email.templates.verification.variant,
        context: {
          user,
          url,
          token,
        },
      });
    },
  },

  account: config.auth.account,

  socialProviders: config.auth.socialProviders,
});
