import React, { JSX } from "react";
import { Html, Button, Head, Text } from "@react-email/components";
import { mail } from "../../../../index";
import { EmailVerificationProps } from "../props";

export function BaseEmailVerificationVariant({
    user,
    url,
    token
}: EmailVerificationProps): JSX.Element {
    return (
        <Html>
            <Head />
            <Text>Hi, {user.name || user.email}!</Text>
            <Text>
                Please verify your email address by clicking the button below.
            </Text>
            <Text>
                If you did not request this, please ignore this email.
            </Text>
            <Text>
                Your verification token is: <strong>{token}</strong>
            </Text>
            <Text>
                If you have any questions, feel free to contact support.
            </Text>
            <Button href={url}></Button>
        </Html>
    );
}

mail.registerTemplate(
    "email-verification",
    "basic",
    BaseEmailVerificationVariant
)