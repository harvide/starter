import { MailAdapter, MailOptions } from "../index";
import { Resend } from "resend";
import { EmailAddress } from "../../../config/src/schema";
import { formatEmailAddress } from "../utils";

export class ResendAdapter implements MailAdapter {
  private resend: Resend;

  constructor() {
    const apiKey =  process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    this.resend = new Resend(apiKey);
  }

  async send(mailOptions: MailOptions): Promise<void> {
    const { from, to, subject, body, ...rest } = mailOptions;

    await this.resend.emails.send({
      to: Array.isArray(to) ? to : [to],
      from: formatEmailAddress(from),
      subject: subject,
      html: body,
      ...rest,
    });
  }
}
