import { Card, CardContent } from "@repo/ui/components/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We may collect personal information that you voluntarily provide to us when you register for the services, express an interest in obtaining information about us or our products and services, when you participate in activities on the services, or otherwise when you contact us.
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li><strong>Personal Data:</strong> Name, email address, phone number, and other similar contact data.</li>
            <li><strong>Usage Data:</strong> Information about how you access and use our services, such as your IP address, browser type, operating system, and pages viewed.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use information collected via our services for various business purposes described below:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To respond to your inquiries and offer support.</li>
            <li>To improve our services and user experience.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Disclosure of Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Security of Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Privacy Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us to exercise these rights.
          </p>

          <p className="text-muted-foreground mt-8">
            For more information, please refer to our <Link href="/legal/terms-of-service" className="underline">Terms of Service</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
