import "./load-env";
import { envSchema, configSchema, type BaseConfig } from "./schema";
import userConfig from "./config";

const env = envSchema.parse(process.env);

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
});

export type FullConfig = BaseConfig & {
  plugins: typeof userConfig.plugins;
};

export const config: FullConfig = {
  ...baseConfig,
  plugins: userConfig.plugins,
};