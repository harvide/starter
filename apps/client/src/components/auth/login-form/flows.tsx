import { authClient } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export type LoginFlowProps = {
  onError: (error: string) => void;
  onSuccess: () => void;
  onOtpRequired: (value: string, type: "email" | "phone") => void;
};

export async function handleEmailPasswordLogin(
  email: string,
  password: string,
  props: LoginFlowProps
) {
  const data = await authClient.signIn.email({
    email,
    password,
    rememberMe: true,
    callbackURL: '/app'
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  showToast.success("Login successful!");
  props.onSuccess();
}

export async function handlePhonePasswordLogin(
  phone: string,
  password: string,
  props: LoginFlowProps
) {
  const data = await authClient.signIn.phoneNumber({
    phoneNumber: phone,
    password,
    rememberMe: true
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  showToast.success(<>Hi, {data.data.user.name}!</>, {
    description: <>Good to see you back!</>
  });
  props.onSuccess();
}

export async function handleEmailOtpRequest(
  email: string,
  props: LoginFlowProps
) {
  const data = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in"
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  props.onOtpRequired(email, "email");
}

export async function handlePhoneOtpRequest(
  phone: string,
  props: LoginFlowProps
) {
  const data = await authClient.phoneNumber.sendOtp({
    phoneNumber: phone
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  props.onOtpRequired(phone, "phone");
}

export async function handleOtpVerification(
  code: string,
  value: string,
  type: "email" | "phone",
  props: LoginFlowProps
) {
  if (type === "email") {
    const data = await authClient.signIn.emailOtp({
      email: value,
      otp: code,
    });

    if (data.error) {
      props.onError(`${data.error.code}: ${data.error.message}`);
      return;
    }

    showToast.success(<>Hi, {data.data.user.name}!</>, {
      description: <>Good to see you back!</>
    });
    props.onSuccess();
  } else {
    const data = await authClient.phoneNumber.verify({
      phoneNumber: value,
      code
    });

    if (data.error) {
      props.onError(`${data.error.code}: ${data.error.message}`);
      return;
    }

    showToast.success(<>Hi, {data.data.user.name}!</>, {
      description: <>Good to see you back!</>
    });
    props.onSuccess();
  }
}

export async function handleResetPasswordRequest(
  email: string,
  props: LoginFlowProps
) {
  const { error } = await authClient.requestPasswordReset({
    email: email,
  });

  if (error) {
    props.onError(`${error.code}: ${error.message}`);
    return false;
  }

  showToast.info(<>
    A password reset link has been sent to <b>{email}</b>. Please check your inbox.
    If you don't see it, check your spam folder.
  </>);
  return true;
}

export async function handleOAuthSignIn(
  provider: string,
  props: LoginFlowProps
) {
  const data = await authClient.signIn.social({
    provider,
    callbackURL: '/app'
  });

  if (data.error) {
    props.onError(`${data.error.code}: ${data.error.message}`);
    return;
  }

  showToast.info("Redirecting to " + provider + "...");
}
