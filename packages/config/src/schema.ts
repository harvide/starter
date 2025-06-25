declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXT_PUBLIC_CLIENT_URL: string;
      NEXT_PUBLIC_CORE_URL: string;
      BETTER_AUTH_SECRET: string;
    }
  }
}

type Environment = "development" | "production" | "test";
type EmailProvider = "smtp" | "resend" | "mailgun" | "postmark" | "sendgrid" | "ses" | "none";

export type EmailAddress = {
  /** Email address */
  email: string;
  /** Name of the email address */
  name?: string;
}

/** Base configuration type for the starter project */
export interface BaseConfig {
  /** Environment configuration */
  env: Environment;

  /** UI Component configuration */
  ui: {
    /** Login form variant to use */
    loginForm: import("../../../apps/client/src/components/auth/login-form").LoginFormVariant;
    /** Signup form variant to use */
    signupForm: import("../../../apps/client/src/components/auth/signup-form").SignupFormVariant;
  };

  email: {
    enabled: boolean;
    /** Email provider to use */
    provider: EmailProvider;
    /** Default sender email address */
    from: {
      admin: EmailAddress;
      support: EmailAddress;
      noReply: EmailAddress;
    } | EmailAddress | string;
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

    /** Account */
    account: {
      /** Account linking settings */
      accountLinking: {
        enabled: boolean;
        trustedProviders?: string[];
        allowUnlinkingAll?: boolean;
      }
    }
  };

  /** Admin configuration */
  admin: {
    enabled: boolean;
    defaultRole?: string;
    adminRoles?: string[];
    adminUserIds?: string[];
    impersonationSessionDuration?: number;
    defaultBanReason?: string;
    defaultBanExpiresIn?: number;
    bannedUserMessage?: string;

    /** Admin Panel configuration */
    dashboard: {
      shortcuts: {
        label: string;
        icon?: string | React.ComponentType<any>;
        href: string;
      }[];
      /** Metrics displayed on the admin dashboard */
      metrics: {
        type: import("../../../apps/client/src/components/admin/dashboard/metric-card").MetricType;
      }[];
    }
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