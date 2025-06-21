import { BasicSignupForm } from "./variants/basic";

export type AdminSignupFormProps = React.ComponentProps<typeof BasicSignupForm>;

export const variants = {
  basic: BasicSignupForm
} as const;

export type AdminSignupFormVariant = keyof typeof variants;

export function getAdminSignupFormVariant(variant: AdminSignupFormVariant) {
  return variants[variant];
}
