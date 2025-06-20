const config = {
  auth: {
    // phone number authentication
    phone: {
      // enabling phone number authentication also enables phone number signup 
      enabled: true,

      otp: {
        enabled: false,
        allowedAttempts: 5, // number of allowed attempts for OTP verification
        otpLength: 6,
        expiresIn: 300, // 5 minutes
        requireVerification: true, // require phone number verification
      }
    },

    // email+password
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      disableSignUp: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 3600,

      verificationTokenExpiresIn: 3600, // 1 hour
      sendResetPassword: true, // allow sending reset password emails

      // otp is using emailOTP plugin
      otp: {
        enabled: true,

        otpLength: 6,
        expiresIn: 300, // 5 minutes
        sendVerificationOnSignUp: true,
        disableSignUp: false,

        allowedAttempts: 5,
      }
    },
    socialProviders: {
      apple: {
        enabled: true,
      },
      google: {
        enabled: true,
      },
    },
  },
  branding: {
    name: "Starter",
    description: "A simple authentication solution for your applications.",
    logo: {
      large: "https://harvide.com/logo/big-dark-transparent.svg",
      icon: "https://www.harvide.com/logo/small-dark-white.svg",
      altText: "Harvide Logo",
    },
  },
  preferences: {
    showToasts: {
      // Show success toasts for actions like correct login, sign up, etc.
      success: true,
      // Show toasts for actions like incorrect login, sign up errors, etc.
      error: true,
      // Show toasts for informative messages like password reset, email verification, etc.
      info: true,
      // Show toasts for warnings like weak passwords, etc.
      warning: true,

      debug: true, // only in development
    }
  }
};

export default config;
