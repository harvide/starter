# Starter

Starter is a simple and idiomatic starter kit for building SaaS applications.

You'll never have to worry about boring stuff like authorization, authentication, database, mailing or other common features. Starter provides you with a solid foundation to build your application on top of.

> Starter is a free version on MIT license, which means you can use it for personal and commercial projects without any restrictions.
> There is also a paid version with additional features, better support, early access to new features and a lot of ready to use components. [Starter Pro](https://starter.harvide.com/pro) is available for purchase on our website.

# Features

- **Authentication** - Starter comes with a fully functional authentication system that supports email/password, phone authentication, magic links, and social logins (Google, GitHub, etc.). You can easily add or remove authentication methods. This includes:
  - **Multi-tenacy** - Turnable organizations system that allows you to create and manage organizations, invite users, and assign roles. You can easily customize the organization model and add your own features.
  - **Multi-session** - Support for multiple sessions per user. You can easily manage user sessions and revoke them if needed.
  - **2FA** - Support for two-factor authentication using TOTP (Time-based One-Time Password) or WebAuthn. You can easily enable or disable 2FA for your users.
  - **OTP** - Support for one-time passwords (OTP) for email and phone authentication. You can easily customize the OTP generation and validation logic.
  - **Magic Links** - Support for magic links that allow users to log in without a password. You can easily customize the magic link generation and validation logic.
  - **Social Logins** - Support for social logins using OAuth providers like Google, GitHub, Facebook, etc. You can easily add or remove social login providers.
  - And multiple ready to use Login and Signup components adapted to your flow and design system!
- **Mailing** - Starter includes a mailing system that allows you to send emails for verification, password reset, and other notifications. You can customize the email templates and use any email provider.
- **User Experience** - Customizable user experience with reactive component out of box, beatiful user flows, animations and responsive design.
- **Database** - Starter uses Drizzle ORM for database access. It supports multiple databases and allows you to easily switch between them. You can also customize the database schema and add your own models.
- **API** - Starter provides a fully functional API that allows you to access your data and perform CRUD operations. You can easily extend the API with your own endpoints and logic.
- **Admin Panel** - Starter includes a fully functional admin panel that allows you to manage your users, roles, and permissions. You can easily customize the admin panel and add your own features.
- **Localization** - Starter supports multiple languages out of the box. You can easily add new languages and translations.

# Configuration

Starter is meant to be very customizable. Basic stack is:
- **Trpc** used for API and RPC calls.
- **Next.js** used for the frontend and server-side rendering.
- **Drizzle** used for database access.
  * You can customize the database provider and use any database supported by Drizzle.
- **Tailwind CSS** used for styling with **Shadcn UI** components.
- **Zod** used for schema validation.
- **Better Auth** used for authentication and authorization.
  * Starter is designed to automatically detect additional plugins you use with better auth. Seamlessly integrate phone authentication, magic links, social logins, and more.

## Customization
Starter is meant to be one-file customizable. You can change the configuration in the `packages/config/src/config.ts` file. Here you can:
- Change your app's entire branding - name, logo, descriptions. It's adjusted for SEO and social media sharing.
- Change auth behavior - you can enable or disable email verification, phone authentication, magic links, and more.


# Contributors

