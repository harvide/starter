import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from '@react-email/components';
import type { JSX } from 'react';
import { EmailBase } from '../../base';
import type { EmailVerificationProps } from '../props';

export default function Basic({
  user,
  url,
  token,
}: EmailVerificationProps): JSX.Element {
  return (
    <EmailBase>
      <Html>
        <Head />
        <Body className="bg-background font-sans text-foreground">
          <Container className="p-4">
            <Heading className="font-bold text-2xl">Email Verification</Heading>
            <Section>
              <Text className="text-lg">
                Hi, {user?.name || user?.email || '{name}'}!
              </Text>
              <Text>
                Please verify your email address by clicking the button below.
              </Text>
              <Text>
                If you did not request this, please ignore this email.
              </Text>
            </Section>
            <Section className="my-8 text-center">
              <Button
                className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
                href={url}
              >
                Verify Email
              </Button>
            </Section>
            <Section>
              <Text>
                Your verification token is:{' '}
                <strong className="rounded-md bg-muted p-1 font-mono">
                  {token || '{token}'}
                </strong>
              </Text>
              <Text className="text-muted-foreground text-sm">
                If you have any questions, feel free to contact support.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </EmailBase>
  );
}
