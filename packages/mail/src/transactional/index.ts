import * as emailVerification from "./emails/email-verification/variants";
import * as resetPassword from "./emails/reset-password/variants";

export const templates = {
    "email-verification": {
        variants: emailVerification,
    },
    "reset-password": {
        variants: resetPassword,
    },
} as const;

export type TemplateName = keyof typeof templates;
export type TemplateVariant<T extends TemplateName> = Lowercase<Extract<keyof typeof templates[T]["variants"], string>>;
