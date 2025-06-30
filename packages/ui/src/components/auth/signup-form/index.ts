import { BasicSignupForm } from './variants/basic';

export type SignupFormProps = React.ComponentProps<typeof BasicSignupForm>;

export const variants = {
  basic: BasicSignupForm,
} as const;

export type SignupFormVariant = keyof typeof variants;

export function getSignupFormVariant(variant: SignupFormVariant) {
  return variants[variant];
}
