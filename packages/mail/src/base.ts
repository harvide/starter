import { type JSX } from 'react';

type EmailTemplate = JSX.Element;

export class MailBase {
  private templates: Record<string, Record<string, EmailTemplate | undefined>> = {};

  registerTemplate(
    name: string,
    variant: string,
    template: EmailTemplate
  ) {
    if (!this.templates[name]) {
      throw new Error(`Template "${name}" not registered`);
    }
    if (!this.templates[name]) {
      this.templates[name] = {};
    }
    this.templates[name][variant] = template;
  }

  getTemplate(name: string, variant: string): EmailTemplate | undefined {
    return this.templates[name]?.[variant];
  }
}
