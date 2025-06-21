export interface Environment {
  ENV: "development" | "production" | "test";
  DATABASE_URL: string;
  NEXT_PUBLIC_CLIENT_URL: string;
  NEXT_PUBLIC_CORE_URL: string;
  BETTER_AUTH_SECRET: string;
}

/** Base configuration type for the starter project */
export interface BaseConfig {
  /** Environment configuration */
  env: Environment["ENV"];
  
  /** Database configuration */
  db: {
    url: string;
  };

  /** Authentication configuration */
  auth: {
    /** Phone authentication settings */
    phone: {
      enabled: boolean;
      otp: {
        enabled: boolean;
        otpLength: number;
        expiresIn: number;
        allowedAttempts: number;
        requireVerification: boolean;
      }
    };

    /** Email and password authentication settings */
    emailAndPassword: {
      enabled: boolean;
      autoSignIn?: boolean;
      disableSignUp?: boolean;
      minPasswordLength: number;
      maxPasswordLength: number;
      requireEmailVerification: boolean;
      resetPasswordTokenExpiresIn: number;
      verificationTokenExpiresIn: number;
      sendResetPassword: boolean;
      otp: {
        enabled: boolean;
        otpLength: number;
        expiresIn: number;
        sendVerificationOnSignUp: boolean;
        disableSignUp: boolean;
        allowedAttempts: number;
      }
    };

    /** Social provider configuration */
    socialProviders: Record<string, {
      enabled: boolean;
      [key: string]: unknown;
    }>;
  };

  /** Branding configuration */
  branding: {
    name: string;
    description?: string;
    logo: {
      large: string;
      icon: string;
      altText: string;
    };
  };

  /** URL configuration */
  urls: {
    client: string;
    core: string;
  };

  /** Secret configuration */
  secrets: {
    auth: string;
  };

  /** UI preferences */
  preferences: {
    showToasts: {
      success: boolean;
      error: boolean;
      info: boolean;
      warning: boolean;
      debug: boolean;
    };
  };
}

/** Default environment values */
export const defaultEnv: Environment = {
  ENV: "development",
  DATABASE_URL: "postgres://localhost:5432/starter",
  NEXT_PUBLIC_CLIENT_URL: "http://localhost:3000",
  NEXT_PUBLIC_CORE_URL: "http://localhost:3000/api",
  BETTER_AUTH_SECRET: "development-secret",
};
