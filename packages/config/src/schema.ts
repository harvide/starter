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
      sendEmailVerificationOnSignup: boolean;
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

  /** Branding configuration */
  branding: {
    name: string;
    url: string;
    description?: string;
    logo: {
      large: string;
      icon: string;
      altText: string;
    };
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

    templates: {
      /** Email verification template */
      verification: {
        subject: string;
        variant: import("../../mail/src/transactional").TemplateVariant<"email-verification">;
      };
      /** Password reset template */
      resetPassword: {
        subject: string;
        variant: import("../../mail/src/transactional").TemplateVariant<"reset-password">;
      };
    }
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

    placeholders?: {
      email?: string;
      password?: string;
      username?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
    };
  };

  /** SEO and Metadata configuration */
  seo?: {
    /** Default title for the application */
    title?: string;
    /** Default description for the application */
    description?: string;
    /** Keywords for SEO */
    keywords?: string[];
    /** URL to the canonical version of the site */
    canonicalUrl?: string;

    /** Robots.txt configuration */
    robots?: {
      /** Enable or disable robots.txt generation */
      enabled?: boolean;
      /** Custom rules for robots.txt */
      rules?: {
        userAgent: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
      }[];
    };

    /** Sitemap configuration */
    sitemap?: {
      /** Enable or disable sitemap generation */
      enabled?: boolean;
      /** Base URL for the sitemap */
      baseUrl?: string;
    };

    /** Favicon configuration 
     * Use https://realfavicongenerator.net/ to generate favicons
    */

    /** OpenGraph configuration */
    openGraph?: {
      /** Enable or disable OpenGraph tags */
      enabled?: boolean;
      /** URL to the OpenGraph image */
      imageUrl?: string;
      /** Alt text for the OpenGraph image */
      imageAlt?: string;
    };
  };

  /** UI Component configuration */
  ui: {
    /** Login form variant to use */
    loginForm: import("../../../apps/client/src/components/auth/login-form").LoginFormVariant;
    /** Signup form variant to use */
    signupForm: import("../../../apps/client/src/components/auth/signup-form").SignupFormVariant;
  };
}
