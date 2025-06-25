import { SMTPAdapter } from "./adapters/smtp";
import { ResendAdapter } from "./adapters/resend";
import { EmailAddress } from "../../config/src/schema";

export interface MailAdapter {
  send(mailOptions: MailOptions): Promise<void>;
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
