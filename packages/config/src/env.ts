import './load-env'
import { z } from "zod";

const envSchema = z.object({
    ENV: z.enum(["development", "production", "test"]),

    // Database configuration
    DATABASE_URL: z.string().url(),
    
    // Base URLs
    NEXT_PUBLIC_CLIENT_URL: z.string().url(),
    NEXT_PUBLIC_CORE_URL: z.string().url(),

    // Authentication
    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
});

export const env = envSchema.parse(process.env);