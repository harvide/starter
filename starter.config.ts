/**
 * @type {import('@repo/config').Config}
 * Main configuration for the Harvide Starter project.
 * Customize authentication flows, branding, and preferences.
 */
export default {
  /** Polar Payment configuration
   * For Stripe configuration, @see https://starter.harvide.com/docs/payments/stripe
  */
  payments: {
    /** Enable payment functionality */
    enabled: true,
    /** Create customer record when user signs up */
    createCustomerOnSignUp: true,
    /** Provider specific configuration */
    provider: {
      /** Select payment provider */
      name: 'polar',
      /** Environment configuration for Polar */
      environment: 'sandbox'
    },
    /** Products configuration for Polar */
    checkout: {
      enabled: true,
      products: [
        {
          productId: '29b33f6b-47ea-4819-9906-4347b2fa8837',
          slug: 'free'
        },
        {
          productId: '64a47469-a020-490f-b93a-a44d584d50c8',
          slug: 'pro'
        }
      ]
    },
    /** Usage based billing settings */
    usage: {
      enabled: false
    },
    /** Customer portal configuration */
    portal: {
      enabled: true,
      externalPortal: true,
      returnUrl: '/dashboard'
    },
    /** Webhook integration */
    webhooks: {
      enabled: false
    }
  },

  /** Admin panel configuration */
  admin: {
    /** Enable or disable the admin panel */
    enabled: true,
    // defaultRole: "user",
    /** The roles that are considered admin roles. Defaults to ["admin"].
     * @default ["admin"]
     */
    // adminRoles: [],
    /** You can pass an array of userIds that should be considered as admin.
     * @default []
     */
    // adminUserIds: [],
    /**
     * The duration of the impersonation session in seconds. Defaults to 1 hour.
     * @default 86400 (24 hours)
     */
    impersonationSessionDuration: 60 * 60 * 24,
    /** The default ban reason for a user created by the admin. Defaults to No reason.
     * @default "No reason"
     */
    defaultBanReason: 'No reason',
    /** The default ban duration in seconds. Defaults to 1 day.
     * @default 86400 (24 hours)
     */
    defaultBanExpiresIn: 60 * 60 * 24,
    /**The message to show when a banned user tries to sign in.
     * @default "You have been banned from this application. Please contact support if you believe this is an error."
     */
    bannedUserMessage:
      'You have been banned from this application. Please contact support if you believe this is an error.',

    /** Admin panel UI configuration */
    dashboard: {
      /**
       * Shortcuts shown in top navigation bar.
       * Order matters, first item is the first shown.
       */
      shortcuts: [
        {
          label: 'GitHub',
          href: 'https://github.com/harvide/starter',
          icon: require('lucide-react').Github,
        },
        {
          label: 'Harvide',
          href: 'https://harvide.com',
          icon: 'https://harvide.com/logo/small-dark-white.svg',
        },
        {
          label: 'Documentation',
          href: 'https://starter.harvide.com/docs',
        },
      ],
      /** Metrics displayed on the admin dashboard */
      metrics: [
        {
          type: 'total_users',
        },
        {
          type: 'new_users_month',
        },
        {
          type: 'active_users_month',
        },
        {
          type: 'active_sessions_now',
        },
      ],
    },
  },

  /** Authentication configuration for all supported methods */
  auth: {
    /** Phone number authentication settings */
    phone: {
      /**
       * Enable phone number authentication.
       * When enabled, users can sign up and sign in using phone numbers.
       * @default true
       */
      enabled: true,

      /** One-Time Password (OTP) settings for phone authentication */
      otp: {
        /**
         * Enable OTP verification for phone numbers.
         * @default false
         */
        enabled: false,

        /**
         * Maximum number of OTP verification attempts before lockout.
         * @default 5
         */
        allowedAttempts: 5,

        /**
         * Length of the generated OTP code.
         * @default 6
         */
        otpLength: 6,

        /**
         * Time in seconds before OTP expires.
         * @default 300 (5 minutes)
         */
        expiresIn: 300,

        /**
         * Require phone number verification before allowing account access.
         * @default true
         */
        requireVerification: true,
      },
    },

    /** Email and password authentication settings */
    emailAndPassword: {
      /**
       * Enable email and password authentication.
       * @default true
       */
      enabled: true,

      /**
       * Automatically sign in user after email verification.
       * @default false
       */
      autoSignIn: true,

      /**
       * Disable new user registration via email.
       * @default false
       */
      disableSignUp: false,

      /**
       * Minimum password length requirement.
       * @default 8
       */
      minPasswordLength: 8,

      /**
       * Maximum password length limit.
       * @default 128
       */
      maxPasswordLength: 128,

      /**
       * Require email verification before allowing account access.
       * @default true
       * @requires mail.enabled - Email service must be configured
       * @requires mail.templates.verification - Email verification template must be configured
       */
      requireEmailVerification: true,
      /**
       * Send email verification after user signs up.
       * If enabled, users will receive a verification email with a link to activate their account.
       * @default true
       * @requires mail.enabled - Email service must be configured
       * @requires mail.templates.verification - Email verification template must be configured
       */
      sendEmailVerificationOnSignup: true,

      /**
       * Time in seconds before password reset token expires.
       * @default 3600 (1 hour)
       */
      resetPasswordTokenExpiresIn: 3600,

      /**
       * Time in seconds before email verification token expires.
       * @default 3600 (1 hour)
       * @requires mail.enabled - Email service must be configured
       */
      verificationTokenExpiresIn: 3600,

      /**
       * Enable password reset functionality.
       * When enabled, users can request password reset emails.
       * @default true
       * @requires mail.enabled - Email service must be configured
       * @requires mail.templates.resetPassword - Reset password email template must be configured
       */
      sendResetPassword: true,

      /** Email OTP settings using the emailOTP plugin */
      otp: {
        /**
         * Enable email OTP authentication.
         * @default true
         */
        enabled: false,

        /**
         * Length of the generated OTP code.
         * @default 6
         */
        otpLength: 6,

        /**
         * Time in seconds before OTP expires.
         * @default 300 (5 minutes)
         */
        expiresIn: 300,

        /**
         * Send verification code when user signs up.
         * @default true
         * @requires mail.enabled - Email service must be configured
         * @requires mail.templates.otp - OTP email template must be configured
         */
        sendVerificationOnSignUp: true,

        /**
         * Disable new user registration via email OTP.
         * @default false
         */
        disableSignUp: false,

        /**
         * Maximum number of OTP verification attempts before lockout.
         * @default 5
         */
        allowedAttempts: 5,
      },
    },
    /** Social authentication providers configuration
     * This section allows you to configure third-party social login providers.
     * Basic usage is enabled only to showcase the functionality (logos appearing in login form automatically).
     * It must be configured. Please read the documentation of Better Auth
     * @see {@link https://www.better-auth.com/docs/concepts/oauth Better Auth OAuth docs}
     */
    socialProviders: {
      apple: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
      /** Google Sign In configuration */
      google: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
      linkedin: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
    },

    /** Account management settings */
    account: {
      /** Account linking configuration
       * @see https://www.better-auth.com/docs/concepts/users-accounts#account-linking
       */
      accountLinking: {
        /**
         * Enable account linking feature.
         * Allows users to link multiple social accounts to a single user account.
         * @default true
         */
        enabled: true,
        /**
         * Trusted providers for account linking.
         * Users can link accounts from these providers.
         * This is optional and can be customized based on your requirements.
         */
        // trustedProviders: ["google", "apple"],
        /**
         * If the user only has one account, the unlinking process will fail to prevent account lockout
         * unless allowUnlinkingAll is set to true.
         * @default false
         */
        allowUnlinkingAll: false,
      },
    },
  },

  /** Application branding configuration */
  branding: {
    /**
     * Application name.
     * Used in UI elements and email templates.
     */
    name: 'Starter',

    /**
     * Application URL
     */
    url: 'https://starter.harvide.com',

    /**
     * Application description.
     * Used in meta tags and documentation.
     */
    description:
      'Never handle flows manually again. Use Harvide Starter to kickstart your next project with pre-configured authentication and UI components.',

    /** Logo configuration */
    logo: {
      /**
       * URL to full-size logo image.
       * Used in login pages and email headers.
       */
      large: 'https://harvide.com/logo/big-dark-transparent.svg',

      /**
       * URL to icon-size logo image.
       * Used in favicons and small UI elements.
       */
      icon: 'https://www.harvide.com/logo/small-dark-white.svg',

      /**
       * Alternative text for logo images.
       * Important for accessibility.
       */
      altText: 'Harvide Logo',
    },
  },

  /** Mail service configuration */
  email: {
    /** Enable or disable email service */
    enabled: true,
    /** Email provider to use */
    provider: 'resend', // Options: "resend", "mailgun", "smtp"
    /** Default sender email address */
    from: {
      admin: {
        email: 'admin@harvide.com',
        name: 'Harvide Admin',
      },
      support: {
        email: 'contact@harvide.com',
        name: 'Harvide Support',
      },
      noReply: {
        email: 'no-reply@harvide.com',
      },
    },

    /** Email templates configuration */
    templates: {
      /** Email verification template */
      verification: {
        subject: 'Verify your email address',
        variant: 'basic',
      },
      /** Password reset template */
      resetPassword: {
        subject: 'Reset your password',
        variant: 'basic',
      },
    },
  },

  /** User interface preferences */
  preferences: {
    /** Toast notification settings */
    showToasts: {
      /**
       * Show success notifications.
       * For actions like successful login, sign up, etc.
       * @default true
       */
      success: true,

      /**
       * Show error notifications.
       * For issues like failed login attempts, validation errors, etc.
       * @default true
       */
      error: true,

      /**
       * Show informational notifications.
       * For events like password reset emails, verification required, etc.
       * @default true
       */
      info: true,

      /**
       * Show warning notifications.
       * For alerts like weak passwords, session timeouts, etc.
       * @default true
       */
      warning: true,

      /**
       * Show debug notifications.
       * Only enabled in development environment.
       * @default true
       */
      debug: true,
    },

    placeholders: {
      email: 'starter@harvide.com',
      password: '••••••••',
      phone: '+1 234 567 8900',

      firstName: 'John',
      lastName: 'Doe',

      username: 'johndoe',
    },
  },

  /** SEO and Metadata configuration */
  seo: {
    /**
     * Set the title of the application.
     * This title and description are used in layout.tsx.
     * There are few pages (/auth, /admin) that override this meta.
     * You can customize other pages' titles in their respective components.
     * @default true
     */
    title: 'Harvide Starter',
    description:
      'Never handle flows manually again. Use Harvide Starter to kickstart your next project with pre-configured authentication and UI components.',
    keywords: [
      'authentication',
      'nextjs',
      'react',
      'typescript',
      'auth',
      'starter',
      'template',
      'boilerplate',
      'harvide',
    ],
    canonicalUrl: 'https://starter.harvide.com',
    robots: {
      enabled: true,
      rules: [
        {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/admin'],
        },
      ],
    },
    /**
     * Sitemap configuration
     * This section allows you to configure the sitemap for your application.
     * It is used to generate a sitemap.xml file for search engines.
     * This should be adjusted based on your application's structure and routes.
     * @see apps/client/src/app/sitemap.ts
     * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
     */
    sitemap: {
      /**
       * Enable or disable sitemap generation.
       * @default true
       */
      enabled: true,
      /**
       * The base URL for the sitemap.
       * This is used to generate absolute URLs in the sitemap.
       * This corresponds to the root URL of your application.
       */
      baseUrl: 'https://starter.harvide.com',
    },
    /**
     * Open Graph configuration
     * This section allows you to configure Open Graph metadata for social media sharing.
     * It is used to enhance link previews on platforms like Facebook, Twitter, etc.
     */
    openGraph: {
      enabled: true,
      imageUrl: 'https://starter.harvide.com/harvide-starter-banner.png',
      imageAlt: 'Harvide Starter Banner',
    },
  },

  /** UI Component configuration */
  ui: {
    /**
     * Login form variant to use.
     * Choose which login form implementation to display.
     * @default "basic"
     */
    loginForm: 'basic',
    /**
     * Signup form variant to use.
     * Choose which signup form implementation to display.
     * @default "basic"
     */
    signupForm: 'basic',
    /**
     * Reset password form variant to use.
     * Choose which reset password form implementation to display.
     * @default "basic"
     */
    resetPasswordForm: 'basic',
  },
} satisfies import('./packages/config/src/index').BaseConfig;
