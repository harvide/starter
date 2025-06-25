import { type MailAdapter, type MailOptions } from "../index";
import { Resend } from "resend";
import { formatEmailAddress } from "../utils";
import { MailBase } from "../base";

export class ResendAdapter extends MailBase implements MailAdapter {
  private resend: Resend;

  constructor() {
    super();
    const apiKey =  process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    this.resend = new Resend(apiKey);
  }

  isProperlyConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
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
