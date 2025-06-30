import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { MailBase } from '../base';
import type {
  MailAdapter,
  MailOptions,
  MailOptionsWithTemplate,
} from '../index';
import { formatEmailAddress } from '../utils';

export class SMTPAdapter extends MailBase implements MailAdapter {
  private transporter: any;

  constructor() {
    super();
    const host = process.env.SMTP_HOST;
    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!(host && user && pass)) {
      throw new Error(
        'SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
      );
    }
    if (Number.isNaN(port)) {
      throw new Error('SMTP_PORT must be a valid number.');
    }
    if (secure && port !== 465) {
      throw new Error('If SMTP_SECURE is true, SMTP_PORT must be 465.');
    }
    if (!secure && port !== 587) {
      throw new Error('If SMTP_SECURE is false, SMTP_PORT must be 587.');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  isProperlyConfigured(): boolean {
    return !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );
  }

  async send(mailOptions: MailOptions): Promise<void> {
    const { from, to, subject, body, ...rest } = mailOptions;

    await this.transporter.sendMail({
      from: formatEmailAddress(from),
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html: body,
      ...rest,
    });
  }

  async sendTemplate(mailOptions: MailOptionsWithTemplate): Promise<void> {
    const {
      from,
      to,
      subject,
      template,
      variant,
      context = {},
      ...rest
    } = mailOptions;

    const EmailTemplate = this.getTemplate(template, variant) as React.FC<any>;
    if (!EmailTemplate) {
      throw new Error(`Email template "${template}" not found`);
    }

    await this.transporter.sendMail({
      to: Array.isArray(to) ? to : [to],
      from: formatEmailAddress(from),
      subject,
      html: await render(EmailTemplate(context) as React.ReactNode),
      ...rest,
    });
  }
}
