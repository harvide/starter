import { Card, CardContent } from '@repo/ui/components/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 md:p-8">
          <h1 className="mb-4 font-bold text-3xl">Privacy Policy</h1>
          <p className="mb-4 text-muted-foreground">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website and use our services.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            1. Information We Collect
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may collect personal information that you voluntarily provide to
            us when you register for the services, express an interest in
            obtaining information about us or our products and services, when
            you participate in activities on the services, or otherwise when you
            contact us.
          </p>
          <ul className="mb-4 list-inside list-disc text-muted-foreground">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number,
              and other similar contact data.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and
              use our services, such as your IP address, browser type, operating
              system, and pages viewed.
            </li>
          </ul>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 text-muted-foreground">
            We use information collected via our services for various business
            purposes described below:
          </p>
          <ul className="mb-4 list-inside list-disc text-muted-foreground">
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To respond to your inquiries and offer support.</li>
            <li>To improve our services and user experience.</li>
          </ul>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            3. Disclosure of Your Information
          </h2>
          <p className="mb-4 text-muted-foreground">
            We may share your information with third parties that perform
            services for us or on our behalf, including payment processing, data
            analysis, email delivery, hosting services, customer service, and
            marketing assistance.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            4. Security of Your Information
          </h2>
          <p className="mb-4 text-muted-foreground">
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable.
          </p>

          <h2 className="mt-6 mb-2 font-semibold text-2xl">
            5. Your Privacy Rights
          </h2>
          <p className="mb-4 text-muted-foreground">
            You have certain rights regarding your personal information,
            including the right to access, correct, or delete your data. Please
            contact us to exercise these rights.
          </p>

          <p className="mt-8 text-muted-foreground">
            For more information, please refer to our{' '}
            <Link className="underline" href="/legal/terms-of-service">
              Terms of Service
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
