# Starter

Starter is a simple and idiomatic starter kit for building SaaS applications.

> Starter is a free version on MIT license, which means you can use it for personal and commercial projects without any restrictions.
> There is also a paid version with additional features, better support, early access to new features and a lot of ready to use components. [Starter Pro](https://starter.harvide.com/pro) is available for purchase on our website.

# Features

- **Modular**: Use only the features you need.
- **Extensible**: Easily add new features or replace existing ones.
- **Idiomatic**: Follows best practices and conventions of the language and framework.

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

