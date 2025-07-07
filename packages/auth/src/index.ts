import { config } from '@repo/config';
import { db, schema, userModel } from '@repo/db';
import { mail } from '@repo/mail';
import { type BetterAuthPlugin, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, emailOTP, openAPI, phoneNumber } from 'better-auth/plugins';
import { polar, checkout, portal, usage, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';

// Initialize Polar client
const polarClient = config.payments.provider.name === "polar" && new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: config.payments.provider.environment || 'sandbox'
});

// Initialize Stripe client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

let plugins: BetterAuthPlugin[] = [
  nextCookies(),
  stripe({
    stripeClient,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    createCustomerOnSignUp: config.payments.createCustomerOnSignUp,
  }),
  admin({
    ...config.admin,
  }),
  emailOTP({
    ...config.auth.emailAndPassword.otp,

    // uncomment to use a custom OTP generation function
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

type _PolarPlugin = ReturnType<typeof checkout> | ReturnType<typeof usage> | ReturnType<typeof portal> | ReturnType<typeof webhooks>;
type _PolarPlugins = [_PolarPlugin, ..._PolarPlugin[]];

if (config.payments.provider.name === 'polar') {
  plugins.push(polar({
    client: polarClient,
    createCustomerOnSignUp: config.payments.createCustomerOnSignUp,
    use: [
      config.payments.checkout.enabled && checkout({
        products: config.payments.checkout.products,
        successUrl: '/dashboard?checkout_id={CHECKOUT_ID}&t=success',
        authenticatedUsersOnly: true,
      }),
      config.payments.portal.enabled && portal(),
      config.payments.usage.enabled && usage(),
      config.payments.webhooks.enabled && webhooks({
        secret: process.env.POLAR_WEBHOOK_SECRET as string,

        // Implement your webhook handling logic here
        // @see https://www.better-auth.com/docs/plugins/polar#webhooks-plugin
      }),
    ].filter(Boolean) as _PolarPlugins,
  }));
} else if (config.payments.provider.name === 'stripe') {
  plugins.push(stripe({
    stripeClient,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
    createCustomerOnSignUp: config.payments.createCustomerOnSignUp,
    onEvent: async (event) => {
      if (!config.payments.webhooks.enabled) return;

      // Implement your webhook handling logic here
      // @see https://www.better-auth.com/docs/plugins/stripe#webhook-handling
    }
  }
  ))
}

// BetterAuth object 

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
