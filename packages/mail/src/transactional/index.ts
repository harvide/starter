import emailVerificationBasic from "./emails/email-verification/variants/basic";
import resetPasswordBasic from "./emails/reset-password/variants/basic";

export const templates = {
    "email-verification": {
        variants: {
            basic: emailVerificationBasic,
        },
    },
    "reset-password": {
        variants: {
            basic: resetPasswordBasic,
        },
    },
} as const;

export type TemplateName = keyof typeof templates;
export type TemplateVariant<T extends TemplateName> = keyof typeof templates[T]["variants"];
