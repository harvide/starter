// packages/config/src/index.ts

import "./load-env";
import { z } from "zod";

/**
 * Step 1 – Pure .env parsing
 */
const envSchema = z.object({
  ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_CLIENT_URL: z.string().url(),
  NEXT_PUBLIC_CORE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
});

const env = envSchema.parse(process.env);

/**
 * Step 2 – Structured runtime config (env + app-level values)
 */
const configSchema = z.object({
  env: z.literal(env.ENV),
  db: z.object({
    url: z.literal(env.DATABASE_URL),
  }),
  auth: z.object({
    emailAndPassword: z.object({
      enabled: z.boolean().default(true),
      autoSignIn: z.boolean().default(false),
      disableSignUp: z.boolean().default(false),
      minPasswordLength: z.number().min(1).default(8),
      maxPasswordLength: z.number().min(1).default(128),
      requireEmailVerification: z.boolean().default(true),
      resetPasswordTokenExpiresIn: z.number().min(1).default(3600),
    }),
    emailVerification: z.object({
      enabled: z.boolean().default(true),
    }),
    socialProviders: z.record(
      z.string(),
      z.object({
        enabled: z.boolean().default(false),
      }).and(
        z.record(z.string(), z.unknown())
      )
    ).default({})
  }),

  branding: z.object({
    name: z.literal("Better Auth"),
    description: z.literal("A simple authentication solution for your applications."),
    logo: z.object({
      large: z.string().url(),
      icon: z.string().url(),
      altText: z.string().min(1, "Logo alt text is required"),
    })
  }),

  urls: z.object({
    client: z.literal(env.NEXT_PUBLIC_CLIENT_URL),
    core: z.literal(env.NEXT_PUBLIC_CORE_URL),
  }),
  secrets: z.object({
    auth: z.literal(env.BETTER_AUTH_SECRET),
  })
});

export const config = configSchema.parse({
  env: env.ENV,
  db: { url: env.DATABASE_URL },
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
    emailVerification: {
      enabled: true,
    },
    socialProviders: {},
  },
  urls: {
    client: env.NEXT_PUBLIC_CLIENT_URL,
    core: env.NEXT_PUBLIC_CORE_URL,
  },
  secrets: {
    auth: env.BETTER_AUTH_SECRET,
  }
});

export { env };
export type AppConfig = z.infer<typeof configSchema>;
