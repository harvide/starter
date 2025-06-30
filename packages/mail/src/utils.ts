import type { EmailAddress } from '../../config/src/schema';

export function formatEmailAddress(email: EmailAddress | string) {
  if (typeof email === 'string') {
    return email;
  }
  if (typeof email === 'object' && email.email) {
    return email.name ? `"${email.name}" <${email.email}>` : email.email;
  }
  throw new Error('Invalid email address format');
}
