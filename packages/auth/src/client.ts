import {
  adminClient,
  emailOTPClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { polarClient } from '@polar-sh/better-auth';
import { stripeClient } from '@better-auth/stripe/client';

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    phoneNumberClient(),
    adminClient(),
    polarClient(), // todo, consider if we could dynamically load this based on config
    stripeClient({
      subscription: true,
    })
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
