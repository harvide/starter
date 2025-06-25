import { SMTPAdapter } from "./adapters/smtp";
import { ResendAdapter } from "./adapters/resend";
import { MailBase } from "./base";
import { type EmailAddress } from "../../config/src/schema";
import { config } from "@repo/config";

export interface MailAdapter extends MailBase {
  // Send an email using the mail adapter
  send(mailOptions: MailOptions): Promise<void>;
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
