import { envSchema, configSchema, type BaseConfig } from "./schema";
import userConfig from "./config";
import type z from "zod";

let env: z.infer<typeof envSchema>;

if (typeof window === "undefined") {
  // parse .env on the server
  require("./load-env");
  env = envSchema.parse(process.env);
} else {
  // won't be used in the browser, but we need to define it for type safety
  env = {
    ENV: "development",
    DATABASE_URL: "postgres://test.test",
    NEXT_PUBLIC_CLIENT_URL: "https://test.test",
    NEXT_PUBLIC_CORE_URL: "https://test.test",
    BETTER_AUTH_SECRET: "test123",
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
    ),
  } as z.infer<typeof envSchema>;
}
const baseConfig = configSchema.parse({
  env: env.ENV,
  db: { url: env.DATABASE_URL },
  urls: {
    client: env.NEXT_PUBLIC_CLIENT_URL,
    core: env.NEXT_PUBLIC_CORE_URL,
  },
  secrets: {
    auth: env.BETTER_AUTH_SECRET,
  },
  auth: userConfig.auth,
  branding: userConfig.branding,
  preferences: userConfig.preferences,
});

export const config = baseConfig