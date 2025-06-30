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
import type { ResetPasswordProps } from '../props';

export default function Basic({
  user,
  url,
  token,
}: ResetPasswordProps): JSX.Element {
  return (
    <EmailBase>
      <Html>
        <Head />
        <Body className="bg-background font-sans text-foreground">
          <Container className="p-4">
            <Heading className="font-bold text-2xl">Password Reset</Heading>
            <Section>
              <Text className="text-lg">
                Hi, {user?.name || user?.email || '{name}'}!
              </Text>
              <Text>
                You have requested to reset your password. Click the button
                below to reset it.
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
                Reset Password
              </Button>
            </Section>
            <Section>
              <Text>
                Your reset token is:{' '}
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
