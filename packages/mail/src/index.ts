import { SMTPAdapter } from "./adapters/smtp";
import { ResendAdapter } from "./adapters/resend";
import { MailBase } from "./base";
import { type EmailAddress } from "../../config/src/schema";
import { config } from "@repo/config";
import { templates } from "./transactional";

export interface MailAdapter extends MailBase {
  // Send an email using the mail adapter
  send(mailOptions: MailOptions): Promise<void>;
  // Send from a template using the mail adapter
  sendTemplate(mailOptions: Omit<MailOptions, "body"> & { template: string; context?: Record<string, any>; },): Promise<void>;
  // Check if the mail adapter is properly configured
  isProperlyConfigured(): boolean;
}

export interface MailOptions {
  from: EmailAddress | string;
  to: string | string[];
  subject: string;
  body: string;
  [key: string]: any;
}

export interface MailOptionsWithTemplate extends MailOptions {
  template: string;
  variant: string;
  context?: Record<string, any>;
}

export function createMailAdapter(
  adapter: "smtp" | "resend",
): MailAdapter {
  switch (adapter) {
    case "smtp":
      return new SMTPAdapter();
    case "resend":
      return new ResendAdapter();
    default:
      throw new Error("Invalid mail adapter");
  }
}

export const mail = createMailAdapter(config.email.provider);

for (const [templateName, template] of Object.entries(templates)) {
  for (const [variantName, variantComponent] of Object.entries(template.variants)) {
    mail.registerTemplate(
      templateName,
      variantName,
      variantComponent
    );
  }
}
