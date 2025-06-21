/** 
 * @type {import('@repo/config').Config}
 * Main configuration for the Harvide Starter project.
 * Customize authentication flows, branding, and preferences.
 */
export default {
    /** UI Component configuration */
    ui: {
        /** 
         * Login form variant to use.
         * Choose which login form implementation to display.
         * @default "basic"
         */
        loginForm: "basic",
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
            enabled: false,

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
            }
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
            autoSignIn: false,

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
                enabled: true,

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
            }
        },
        /** Social authentication providers configuration
         * This section allows you to configure third-party social login providers.
         * Basic usage is enabled only to showcase the functionality (logos appearing in login form automatically).
         * It must be configured. Please read the documentation of Better Auth
         * @see {@link https://www.better-auth.com/docs/concepts/oauth Better Auth OAuth docs}
        */
        socialProviders: {
            /** Apple Sign In configuration */
            apple: {
                /**
                 * Enable Apple Sign In.
                 * @default true
                 * @requires auth.oauth.apple - Apple OAuth credentials must be configured
                 */
                enabled: true,
            },
            /** Google Sign In configuration */
            google: {
                /**
                 * Enable Google Sign In.
                 * @default true
                 * @requires auth.oauth.google - Google OAuth credentials must be configured
                 */
                enabled: true,
            },
            facebook: {
                enabled: true
            }
        },
    },
    /** Application branding configuration */
    branding: {
        /**
         * Application name.
         * Used in UI elements and email templates.
         */
        name: "Starter",

        /**
         * Application description.
         * Used in meta tags and documentation.
         */
        description: "Never handle flows manually again. Use Harvide Starter to kickstart your next project with pre-configured authentication and UI components.",

        /** Logo configuration */
        logo: {
            /**
             * URL to full-size logo image.
             * Used in login pages and email headers.
             */
            large: "https://harvide.com/logo/big-dark-transparent.svg",

            /**
             * URL to icon-size logo image.
             * Used in favicons and small UI elements.
             */
            icon: "https://www.harvide.com/logo/small-dark-white.svg",

            /**
             * Alternative text for logo images.
             * Important for accessibility.
             */
            altText: "Harvide Logo",
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
        }
    },

    // todo fix
    /** Environment configuration */
    env: "development",

    /** Database configuration */
    db: {
        url: "postgres://user:password@localhost:5432/database",
    },

    /** Application URLs */
    urls: {
        /**
         * Base URL of the application.
         * Example: "https://example.com"
         */
        client: "https://example.com",

        /**
         * API endpoint URL.
         * Example: "https://api.example.com"
         */
        core: "https://api.example.com",
    },

    /** Secrets configuration */
    secrets: {
        /**
         * Secret key for signing tokens.
         * Example: "your-secret-key"
         */
        auth: "your-secret-key",
    }
} satisfies import('./packages/config/src/index').BaseConfig;
