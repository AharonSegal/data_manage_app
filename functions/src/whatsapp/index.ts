import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { sendWhatsApp } from 'datacenter-services/whatsapp/send';
import type { WhatsAppOptions } from 'datacenter-services/types';

/**
 * Firebase HTTPS Callable — send a WhatsApp message via Twilio.
 *
 * Client call (frontend):
 *   const fn = httpsCallable(functions, 'sendWhatsAppHttp');
 *   await fn({ to: '972501234567', body: 'Your certificate is ready.' });
 */
export const sendWhatsAppHttp = onCall(
  { region: 'us-central1' },
  async (request: CallableRequest<WhatsAppOptions>) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in to send WhatsApp.');
    }

    const { to, body, contentSid, contentVariables } = request.data;

    if (!to || (!body && !contentSid)) {
      throw new HttpsError('invalid-argument', 'Missing required fields: to, and either body or contentSid.');
    }

    const result = await sendWhatsApp({ to, body, contentSid, contentVariables });

    if (!result.success) {
      throw new HttpsError('internal', result.error ?? 'WhatsApp sending failed.');
    }

    return { messageId: result.messageId };
  }
);
