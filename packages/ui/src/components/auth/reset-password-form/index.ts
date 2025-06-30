import { BasicResetPasswordForm } from './variants/basic';

export type ResetPasswordFormProps = React.ComponentProps<
  typeof BasicResetPasswordForm
>;

export const variants = {
  basic: BasicResetPasswordForm,
} as const;

export type ResetPasswordFormVariant = keyof typeof variants;

export function getResetPasswordFormVariant(variant: ResetPasswordFormVariant) {
  return variants[variant];
}
