import type { BetterAuthPlugin } from "better-auth";

const config = {
  auth: {
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      disableSignUp: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 3600,
    },
    socialProviders: {},
  },
  branding: {
    name: "Better Auth",
    description: "A simple authentication solution for your applications.",
    logo: {
      large: "https://example.com/logo.svg",
      icon: "https://example.com/icon.svg",
      altText: "Better Auth Logo",
    },
  },
  plugins: [] as BetterAuthPlugin[],
};

export default config;
