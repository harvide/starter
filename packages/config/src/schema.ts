import { z } from "zod";

export const envSchema = z.object({
  ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_CLIENT_URL: z.string().url(),
  NEXT_PUBLIC_CORE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
});

export const configSchema = z.object({
  env: envSchema.shape.ENV,
  db: z.object({
    url: envSchema.shape.DATABASE_URL,
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

      verificationTokenExpiresIn: z.number().min(1).default(3600),
      sendResetPassword: z.boolean().default(false),
      sendVerificationEmail: z.boolean().default(false),
    }),
    socialProviders: z.record(
      z.string(),
      z.object({
        enabled: z.boolean().default(false),
      }).and(z.record(z.string(), z.unknown()))
    ).default({}),
  }),
  branding: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    logo: z.object({
      large: z.string().url(),
      icon: z.string().url(),
      altText: z.string().min(1),
    }),
  }),
  urls: z.object({
    client: envSchema.shape.NEXT_PUBLIC_CLIENT_URL,
    core: envSchema.shape.NEXT_PUBLIC_CORE_URL,
  }),
  secrets: z.object({
    auth: envSchema.shape.BETTER_AUTH_SECRET,
  }),
});

export type BaseConfig = z.infer<typeof configSchema>;