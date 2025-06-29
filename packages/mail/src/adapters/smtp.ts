import type { MailOptionsWithTemplate, MailAdapter, MailOptions } from "../index";
import nodemailer from "nodemailer";
import { formatEmailAddress } from "../utils";
import { MailBase } from "../base";
import { render } from "@react-email/components";

export class SMTPAdapter extends MailBase implements MailAdapter {
  private transporter: any;

  constructor(
  ) {
    super();
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = process.env.SMTP_SECURE === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      throw new Error("SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.");
    }
    if (isNaN(port)) {
      throw new Error("SMTP_PORT must be a valid number.");
    }
    if (secure && port !== 465) {
      throw new Error("If SMTP_SECURE is true, SMTP_PORT must be 465.");
    }
    if (!secure && port !== 587) {
      throw new Error("If SMTP_SECURE is false, SMTP_PORT must be 587.");
    }

    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  isProperlyConfigured(): boolean {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  async send(mailOptions: MailOptions): Promise<void> {
    const { from, to, subject, body, ...rest } = mailOptions;

    await this.transporter.sendMail({
      from: formatEmailAddress(from),
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: body,
      ...rest,
    });
  }

  async sendTemplate(mailOptions: MailOptionsWithTemplate): Promise<void> {
    const { from, to, subject, template, variant, context = {}, ...rest } = mailOptions;

    const EmailTemplate = this.getTemplate(template, variant) as React.FC<any>;
    if (!EmailTemplate) {
      throw new Error(`Email template "${template}" not found`);
    }

    await this.transporter.sendMail({
      to: Array.isArray(to) ? to : [to],
      from: formatEmailAddress(from),
      subject: subject,
      html: await render(EmailTemplate(context)),
      ...rest,
    });
  }
}
