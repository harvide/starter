import * as emailVerification from "./emails/email-verification/variants";

export const templates = {
    "email-verification": {
        variants: emailVerification,
    },
} as const;

export type TemplateName = keyof typeof templates;
export type TemplateVariant<T extends TemplateName> = Lowercase<Extract<keyof typeof templates[T]["variants"], string>>;
