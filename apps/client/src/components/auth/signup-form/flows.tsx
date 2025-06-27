import { authClient } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export type SignupFlowProps = {
  onError: (error: string) => void;
  onSuccess: () => void;
};

export async function handleEmailPasswordSignup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  props: SignupFlowProps
) {
  const data = await authClient.signUp.email({
    email,
    password,
    name: `${firstName} ${lastName}`,
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  if (data.data) {
    showToast.success(<>Account created successfully!</>);
    props.onSuccess();
  }
}

export async function handleOAuthSignup(
  provider: string,
  props: SignupFlowProps
) {
  const data = await authClient.signIn.social({
    provider,
    callbackURL: '/app'
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  showToast.info(<>Redirecting to {provider}...</>);
}
