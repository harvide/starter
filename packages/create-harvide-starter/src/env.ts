import type { MailProvider, PaymentProvider, SocialProvider } from './types.js';
import { generateSecretKey } from './utils.js';

export function generateEnvContent(
  socialProviders: SocialProvider[] = [],
  mailProvider?: MailProvider,
  paymentProvider?: PaymentProvider,
  useWebhook?: boolean
): string {
  let mailEnv = '';
  if (mailProvider === 'resend') {
    mailEnv = `
# Resend Email Provider
RESEND_API_KEY=""
`;
  } else if (mailProvider === 'smtp') {
    mailEnv = `
# SMTP Email Provider
SMTP_HOST=""
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER=""
SMTP_PASS=""
`;
  }

  let paymentEnv = '';
  if (paymentProvider === 'polar') {
    paymentEnv = `
# Polar Payments
POLAR_ACCESS_TOKEN=""${useWebhook ? '\nPOLAR_WEBHOOK_SECRET=""' : ''}`;
  } else if (paymentProvider === 'stripe') {
    paymentEnv = `
# Stripe Payments
STRIPE_SECRET_KEY=""${useWebhook ? '\nSTRIPE_WEBHOOK_SECRET=""' : ''}`;
  }

  const baseEnv = `# Database
DATABASE_URL="postgres://user:password@localhost:5432/database"

# Auth
AUTH_SECRET="${generateSecretKey(32)}"

${mailEnv}${paymentEnv}`;

  const socialEnv = socialProviders
    .map((provider) => {
      switch (provider) {
        case 'facebook':
          return `# Facebook OAuth
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""`;
        case 'apple':
          return `# Apple OAuth
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
# Optional: if using Apple Sign In for iOS apps using the ID Token.
APPLE_APP_BUNDLE_IDENTIFIER=""`;
        case 'discord':
          return `# Discord OAuth
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""`;
        case 'github':
          return `# GitHub OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""`;
        case 'google':
          return `# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`;
        case 'twitter':
          return `# Twitter OAuth
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""`;
        case 'linkedin':
          return `# LinkedIn OAuth
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""`;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');

  return `${baseEnv}${socialEnv ? `${socialEnv}\n` : ''}`;
}
