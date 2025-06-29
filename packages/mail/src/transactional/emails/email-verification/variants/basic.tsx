import React, { type JSX } from "react";
import { Html, Button, Head, Text, Body, Container, Heading, Section } from "@react-email/components";
import { type EmailVerificationProps } from "../props";
import { EmailBase } from "../../base";

export function Basic({
    user,
    url,
    token
}: EmailVerificationProps): JSX.Element {
    return (
        <EmailBase>
            <Html>
                <Head />
                <Body className="bg-background text-foreground font-sans">
                    <Container className="p-4">
                        <Heading className="text-2xl font-bold">Email Verification</Heading>
                        <Section>
                            <Text className="text-lg">Hi, {user?.name || user?.email || "{name}"}!</Text>
                            <Text>
                                Please verify your email address by clicking the button below.
                            </Text>
                            <Text>
                                If you did not request this, please ignore this email.
                            </Text>
                        </Section>
                        <Section className="text-center my-8">
                            <Button href={url} className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-bold">
                                Verify Email
                            </Button>
                        </Section>
                        <Section>
                            <Text>
                                Your verification token is: <strong className="font-mono bg-muted p-1 rounded-md">{token || "{token}"}</strong>
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
