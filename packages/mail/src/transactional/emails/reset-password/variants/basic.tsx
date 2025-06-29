import React, { type JSX } from "react";
import { Html, Button, Head, Text, Body, Container, Heading, Section } from "@react-email/components";
import { type ResetPasswordProps } from "../props";
import { EmailBase } from "../../base";

export default function Basic({
    user,
    url,
    token
}: ResetPasswordProps): JSX.Element {
    return (
        <EmailBase>
            <Html>
                <Head />
                <Body className="bg-background text-foreground font-sans">
                    <Container className="p-4">
                        <Heading className="text-2xl font-bold">Password Reset</Heading>
                        <Section>
                            <Text className="text-lg">Hi, {user?.name || user?.email || "{name}"}!</Text>
                            <Text>
                                You have requested to reset your password. Click the button below to reset it.
                            </Text>
                            <Text>
                                If you did not request this, please ignore this email.
                            </Text>
                        </Section>
                        <Section className="text-center my-8">
                            <Button href={url} className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-bold">
                                Reset Password
                            </Button>
                        </Section>
                        <Section>
                            <Text>
                                Your reset token is: <strong className="font-mono bg-muted p-1 rounded-md">{token || "{token}"}</strong>
                            </Text>
                            <Text className="text-sm text-muted-foreground">
                                If you have any questions, feel free to contact support.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </EmailBase>
    );
}
