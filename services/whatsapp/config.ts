import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  whatsappFrom: process.env.TWILIO_WHATSAPP_FROM!,
} as const;

const missing = (Object.entries(twilioConfig) as [string, string][])
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.warn(`[WhatsApp] Missing env vars: ${missing.join(', ')}. WhatsApp sending will not work.`);
}
