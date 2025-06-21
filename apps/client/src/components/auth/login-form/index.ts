import { BasicLoginForm } from "./variants/basic";

export type LoginFormProps = React.ComponentProps<typeof BasicLoginForm>;

export const variants = {
  basic: BasicLoginForm
} as const;

export type LoginFormVariant = keyof typeof variants;

export function getLoginFormVariant(variant: LoginFormVariant) {
  return variants[variant];
}
