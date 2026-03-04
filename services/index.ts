// Gmail
export { sendEmail } from './gmail/send';
export { getGmailTransport } from './gmail/transport';

// WhatsApp
export { sendWhatsApp } from './whatsapp/send';
export { createWhatsAppLink } from './whatsapp/deeplink';
export { getTwilioClient } from './whatsapp/client';

// Types
export type { SendResult, EmailOptions, WhatsAppOptions } from './types';
