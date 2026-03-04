import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { sendEmail } from 'datacenter-services/gmail/send';
import type { EmailOptions } from 'datacenter-services/types';

/**
 * Firebase HTTPS Callable — send an email via Gmail OAuth2.
 *
 * Client call (frontend):
 *   const fn = httpsCallable(functions, 'sendEmailHttp');
 *   await fn({ to, subject, html });
 */
export const sendEmailHttp = onCall(
  { region: 'us-central1' },
  async (request: CallableRequest<EmailOptions>) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to send email.');
    }

    const { to, subject, html, cc, bcc, replyTo, attachments } = request.data;

    if (!to || !subject || !html) {
      throw new HttpsError('invalid-argument', 'Missing required fields: to, subject, html.');
    }

    const result = await sendEmail({ to, subject, html, cc, bcc, replyTo, attachments });

    if (!result.success) {
      throw new HttpsError('internal', result.error ?? 'Email sending failed.');
    }

    return { messageId: result.messageId };
  }
);
