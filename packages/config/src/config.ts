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
    socialProviders: {
      apple: {
        enabled: true,
      },
      google: {
        enabled: true,
      },
    },
  },
  branding: {
    name: "Starter",
    description: "A simple authentication solution for your applications.",
    logo: {
      large: "https://harvide.com/logo/big-dark-transparent.svg",
      icon: "https://www.harvide.com/logo/small-dark-white.svg",
      altText: "Harvide Logo",
    },
  },
  plugins: [] as BetterAuthPlugin[],
};

export default config;
