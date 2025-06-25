export interface EmailTemplate {
  subject: string;
  body: string;
}

export class MailBase {
  private templates: Record<string, EmailTemplate> = {};

  registerTemplate(name: string, template: EmailTemplate) {
    this.templates[name] = template;
  }

  getTemplate(name: string): EmailTemplate | undefined {
    return this.templates[name];
  }
}
