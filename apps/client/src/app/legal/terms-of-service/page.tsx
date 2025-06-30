import { Card, CardContent } from '@repo/ui/components/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 md:p-8">
          <h1 className="mb-4 font-bold text-3xl">Terms of Service</h1>
          <p className="mb-4 text-muted-foreground">
            Welcome to our service. By accessing or using our service, you agree
            to be bound by these Terms of Service.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 text-muted-foreground">
            By using our services, you confirm that you accept these terms of
            use and that you agree to comply with them. If you do not agree to
            these terms, you must not use our services.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            2. Changes to Terms
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may revise these terms of use at any time by amending this page.
            Please check this page from time to time to take notice of any
            changes we made, as they are binding on you.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">3. Your Account</h2>
          <p className="mb-4 text-muted-foreground">
            If you choose, or are provided with, a user identification code,
            password or any other piece of information as part of our security
            procedures, you must treat such information as confidential. You
            must not disclose it to any third party.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            4. Prohibited Uses
          </h2>
          <p className="mb-4 text-muted-foreground">
            You may use our services only for lawful purposes. You may not use
            our services:
          </p>
          <ul className="mb-4 list-inside list-disc text-muted-foreground">
            <li>
              In any way that breaches any applicable local, national or
              international law or regulation.
            </li>
            <li>
              In any way that is unlawful or fraudulent, or has any unlawful or
              fraudulent purpose or effect.
            </li>
            <li>
              For the purpose of harming or attempting to harm minors in any
              way.
            </li>
          </ul>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            5. Limitation of Liability
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nothing in these terms of use excludes or limits our liability for
            death or personal injury arising from our negligence, or our fraud
            or fraudulent misrepresentation, or any other liability that cannot
            be excluded or limited by English law.
          </p>

          <p className="mt-8 text-muted-foreground">
            For more information, please refer to our{' '}
            <Link className="underline" href="/legal/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
