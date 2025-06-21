import { Card, CardContent } from "@repo/ui/components/card";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">
            Welcome to our service. By accessing or using our service, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By using our services, you confirm that you accept these terms of use and that you agree to comply with them. If you do not agree to these terms, you must not use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We may revise these terms of use at any time by amending this page. Please check this page from time to time to take notice of any changes we made, as they are binding on you.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Your Account</h2>
          <p className="text-muted-foreground mb-4">
            If you choose, or are provided with, a user identification code, password or any other piece of information as part of our security procedures, you must treat such information as confidential. You must not disclose it to any third party.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Prohibited Uses</h2>
          <p className="text-muted-foreground mb-4">
            You may use our services only for lawful purposes. You may not use our services:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li>In any way that breaches any applicable local, national or international law or regulation.</li>
            <li>In any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect.</li>
            <li>For the purpose of harming or attempting to harm minors in any way.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            Nothing in these terms of use excludes or limits our liability for death or personal injury arising from our negligence, or our fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.
          </p>

          <p className="text-muted-foreground mt-8">
            For more information, please refer to our <Link href="/legal/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
