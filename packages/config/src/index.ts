import type { BaseConfig, Environment } from "./schema";
import { defaultEnv } from "./schema";
import userConfig from "../../../starter.config";

// Load environment variables on the server
if (typeof window === "undefined") {
  require("./load-env");
}

// Get environment values, with fallbacks for browser
const env: Environment = typeof window === "undefined" 
  ? {
      ENV: process.env.ENV as Environment["ENV"] || defaultEnv.ENV,
      DATABASE_URL: process.env.DATABASE_URL || defaultEnv.DATABASE_URL,
      NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || defaultEnv.NEXT_PUBLIC_CLIENT_URL,
      NEXT_PUBLIC_CORE_URL: process.env.NEXT_PUBLIC_CORE_URL || defaultEnv.NEXT_PUBLIC_CORE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || defaultEnv.BETTER_AUTH_SECRET,
    }
  : {
      ...defaultEnv,
      ...Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
      ),
    };

// Merge environment variables and user config
const baseConfig: BaseConfig = {
  env: env.ENV,
  db: { url: env.DATABASE_URL },
  urls: {
    client: env.NEXT_PUBLIC_CLIENT_URL,
    core: env.NEXT_PUBLIC_CORE_URL,
  },
  secrets: {
    auth: env.BETTER_AUTH_SECRET,
  },
  ...userConfig,
};

export const config = baseConfig;

export type { BaseConfig };
